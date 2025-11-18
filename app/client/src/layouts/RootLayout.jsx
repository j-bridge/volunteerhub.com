import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function RootLayout() {
  return (
    <Flex direction="column" minH="100vh" w="100%">
      <NavBar />
      <Box as="main" flex="1" w="100%" alignSelf="stretch">
        <Outlet />
      </Box>
      <Footer />
    </Flex>
  );
}

