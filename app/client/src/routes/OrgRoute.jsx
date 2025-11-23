import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function OrgRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Later this will check user.role === "organization"
  if (user.role !== "organization") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
