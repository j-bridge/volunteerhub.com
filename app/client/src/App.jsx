import { Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Home route (index = default page) */}
        <Route index element={<Home />} />

        {/* Authentication routes */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        {/* Future pages can go here */}
        {/* <Route path="opportunities" element={<Opportunities />} /> */}
        {/* <Route path="about" element={<About />} /> */}
        {/* <Route path="contact" element={<Contact />} /> */}
      </Route>
    </Routes>
  );
}

