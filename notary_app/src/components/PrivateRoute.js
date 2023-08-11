import React from 'react';
import { Navigate, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Element, ...rest }) => {
  // Add your authentication logic here to check if the user is logged in
  const isLoggedIn = true; // Replace with actual logic

  return (
    <Route {...rest} element={isLoggedIn ? <Element /> : <Navigate to="/login" />} />
  );
};

export default PrivateRoute;
