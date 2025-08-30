import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { data, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!data) return <Navigate to="/login" replace />;
  return <Outlet />;
}
