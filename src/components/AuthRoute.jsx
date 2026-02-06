import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default AuthRoute;
