import { Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Volunteer from "./pages/Volunteer"; // acts as the volunteer dashboard
import OrgDashboard from "./pages/OrgDashboard";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Home route (index = default page) */}
        <Route index element={<Home />} />

        {/* Authentication routes */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        {/* Volunteer experience & org dashboard */}
        <Route path="dashboard" element={<Volunteer />} />
        <Route path="opportunities" element={<Volunteer />} />
        <Route path="org/dashboard" element={<OrgDashboard />} />

        {/* Informational pages */}
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}


