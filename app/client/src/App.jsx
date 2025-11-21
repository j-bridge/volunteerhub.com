import { Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";

// Core pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Static pages
import Contact from "./pages/static/contact.jsx";
import About from "./pages/static/about.jsx";

// Opportunities
import Opportunities from "./pages/Opportunities/Opportunities.jsx";
import OpportunityDetails from "./pages/Opportunities/OpportunityDetails.jsx";

// Dashboards
import VolunteerDashboard from "./pages/dashboard/VolunteerDashboard.jsx";
import OrgDashboard from "./pages/dashboard/OrgDashboard.jsx";

// Route guards
import ProtectedRoute from "./routes/ProtectedRoute.jsx"; // <-- make sure this filename matches your file

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>

        {/* Home route (index = default page) */}
        <Route index element={<Home />} />

        {/* Authentication routes */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        {/* Static pages */}
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />

        {/* Opportunities */}
        <Route path="opportunities" element={<Opportunities />} />
        <Route path="opportunities/:id" element={<OpportunityDetails />} />

        {/* Volunteer dashboard (must be logged in, role "volunteer") */}
        <Route element={<ProtectedRoute requiredRole="volunteer" />}>
          <Route path="dashboard" element={<VolunteerDashboard />} />
        </Route>

        {/* Organization dashboard (must be logged in, role "organization") */}
        <Route element={<ProtectedRoute requiredRole="organization" />}>
          <Route path="org/dashboard" element={<OrgDashboard />} />
        </Route>

      </Route>
    </Routes>
  );
}




