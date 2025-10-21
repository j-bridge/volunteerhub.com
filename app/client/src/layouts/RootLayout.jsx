import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function RootLayout() {
  return (
    <Box minH="100dvh" display="flex" flexDirection="column">
      <NavBar />
      <Box as="main" flex="1 1 auto">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
