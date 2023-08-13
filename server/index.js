// server.js

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");

const app = express();
const port = process.env.PORT || 5001;

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  email: String,
  passwordHash: String, // Store the hashed password
});

const User = mongoose.model("User", UserSchema);

app.use(express.json());

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const tokenWithBearer = req.header("Authorization");

  if (!tokenWithBearer) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = tokenWithBearer.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({ email, passwordHash });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while registering" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, refreshToken});
  } catch (error) {
    res.status(500).json({ error: "An error occurred while logging in" });
  }
});

app.post("/refresh-token", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token not provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Verify if the refresh token is valid
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // Generate new access token and refresh token
    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const newRefreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken});
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ error: "Error refreshing token" });
  }
});

app.get("/documents", verifyToken, (req, res) => {
  const documentsFolder = path.join(__dirname, "documents");

  fs.readdir(documentsFolder, (err, files) => {
    if (err) {
      console.error("Error reading documents folder:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    res.json(files);
  });
});

app.get("/documents/getTags/:documentName", verifyToken, (req, res) => {
  const documentName = req.params.documentName;
  const documentPath = path.join(__dirname, "documents", documentName);

  const content = fs.readFileSync(documentPath, "binary"); // Read the Word document content

  const tags = extractTagsFromDocument(content);
  res.json(tags);
});

app.post("/documents/generate/:documentName", verifyToken, (req, res) => {
  const documentName = req.params.documentName;
  const payload = req.body; // Received JSON payload
  const documentPath = path.join(__dirname, "documents", documentName);

  // Load the docx file as binary content
  const content = fs.readFileSync(documentPath, "binary");

  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  // Render the document
  doc.render(payload);

  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  // Send the generated document back to the frontend
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${documentName}"`
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
  res.send(buf);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

////HELPERS/////
function extractTagsFromDocument(content) {
  const zip = new PizZip(content);
  const InspectModule = require("docxtemplater/js/inspect-module");
  const iModule = InspectModule();
  const doc = new Docxtemplater(zip, { modules: [iModule] });
  const tags = iModule.getAllTags();
  return tags;
}
