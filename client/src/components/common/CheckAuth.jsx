import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    console.log("You are not authenticated.");
    return <Navigate to="/auth/login" />;
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  // Prevent admin from accessing shop routes
  if (isAuthenticated && user?.role === "admin" && location.pathname.includes("/shop")) {
    console.log("Admin cannot access shop routes.");
    return <Navigate to="/admin/dashboard" />;
  }

  // Allow non-admin users to access shop routes
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    console.log("You are not admin.");
    return <Navigate to="/unauthpage" />;
  }
  return <>{children}</>;
}

export default CheckAuth;
