import { Box } from "@chakra-ui/react";
import NavBar from "./components/NavBar";

export default function App() {
  return (
    <Box>
      <NavBar />
      <Box p={8} textAlign="center">
        <h1>Welcome to VolunteerHub</h1>
        <p>This is your main app content area.</p>
      </Box>
    </Box>
  );
}