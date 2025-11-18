import { Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Contact from "./pages/static/contact.jsx";
import About from "./pages/static/about.jsx";

import Opportunities from "./pages/Opportunities/Opportunities.jsx";

import VolunteerDashboard from "./pages/dashboard/VolunteerDashboard.jsx";
import OrgDashboard from "./pages/dashboard/OrgDashboard.jsx";

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

        {/* Dashboards */}
        <Route path="dashboard" element={<VolunteerDashboard />} />
        <Route path="org/dashboard" element={<OrgDashboard />} />
      </Route>
    </Routes>
  );
}

