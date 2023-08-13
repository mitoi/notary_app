import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import HomePage from './HomePage';
import { useAuth } from './AuthContext';

function AppRouter() {
  const auth = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<PrivateRoute auth={auth} />} />
        {/* Add more routes for other pages */}
      </Routes>
    </Router>
  );
}

function PrivateRoute({ auth }) {
  return auth.accessToken ? <HomePage /> : <Navigate to="/login" />;
}

export default AppRouter;
