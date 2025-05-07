import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  const isAdmin = token !== null; // If adminToken exists, user is admin

  return token && isAdmin ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;