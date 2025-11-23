import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

/**
 * Protects routes so only logged-in users (optionally with a specific role)
 * can access them.
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}>
 *      <Route path="dashboard" element={<VolunteerDashboard />} />
 *   </Route>
 *
 *   <Route element={<ProtectedRoute requiredRole="organization" />}>
 *      <Route path="org/dashboard" element={<OrgDashboard />} />
 *   </Route>
 */
export default function ProtectedRoute({ requiredRole }) {
  const { user, ready } = useAuth();

  // Wait for AuthContext to load from storage
  if (!ready) return null; // or a spinner later

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and user doesn't match → redirect
  if (requiredRole && user.role !== requiredRole) {
    // You can change this destination if you prefer
    return <Navigate to="/dashboard" replace />;
  }

  // Logged in (and role is OK if required) → render nested routes
  return <Outlet />;
}

