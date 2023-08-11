import React, { createContext, useContext, useState } from 'react';

const TagsContext = createContext();

export const useTags = () => {
  return useContext(TagsContext);
};

export const TagsProvider = ({ children }) => {
  const [tags, setTags] = useState([]);
  const [docName, setDocName] = useState("");

  return (
    <TagsContext.Provider value={{ tags, setTags, docName, setDocName}}>
      {children}
    </TagsContext.Provider>
  );
};
