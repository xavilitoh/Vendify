import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const isTokenValid = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp;
    if (!exp) return false;
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = Cookies.get("token");
  const location = useLocation();

  const isAuthenticated = !!token && isTokenValid(token);

  if (!isAuthenticated) {
    Cookies.remove("token"); // Clear invalid/expired token
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
