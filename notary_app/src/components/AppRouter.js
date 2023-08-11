import React from 'react';
import { BrowserRouter as Router, Routes, Route as RouteAlias } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import HomePage from './HomePage';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <RouteAlias path="/login" element={<LoginPage />} />
        <RouteAlias path="/register" element={<RegisterPage />} />
        <RouteAlias path="/home" element={<HomePage />} />
        {/* Add more routes for other pages */}
      </Routes>
    </Router>
  );
}

export default AppRouter;