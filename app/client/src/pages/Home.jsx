import {
  Box,
  Flex,
  Container,
  Heading,
  Text,
  Button,
  Stack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const goDashboard = () => {
    if (user?.role === "organization") {
      navigate("/org/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <Box w="100%" bg="gray.50">
      <Flex
        maxW="container.xl"
        mx="auto"
        minH={{ base: "calc(100vh - 140px)", md: "calc(100vh - 160px)" }}
        align="center"
        justify="center"
        direction="column"
        textAlign="center"
        px={6}
        py={16}
      >
        {!user ? (
          <>
            <Heading as="h1" size="2xl" mb={4}>
              Cultivating Communities Through Volunteering
            </Heading>

            <Text fontSize="lg" color="gray.600" maxW="720px" mb={8}>
              Welcome to VolunteerHub — a simple way to discover volunteer
              opportunities, connect with nonprofits, and build stronger
              communities. Please log in or sign up to begin your journey!
            </Text>

            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={4}
              justify="center"
            >
              <Button
                colorScheme="teal"
                size="lg"
                onClick={() => navigate("/signup")}
              >
                Sign Up to Get Started
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/login")}
              >
                Log In
              </Button>
            </Stack>
          </>
        ) : (
          <>
            <Heading as="h1" size="2xl" mb={4}>
              Welcome back, {user.name || "Volunteer"}!
            </Heading>

            <Text fontSize="lg" color="gray.600" maxW="720px" mb={8}>
              You're signed in to VolunteerHub. Head to your dashboard to view or
              manage opportunities!
            </Text>

            <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
              <Button colorScheme="teal" size="lg" onClick={goDashboard}>
                Go to My Dashboard
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/opportunities")}
              >
                Browse Opportunities
              </Button>
            </Stack>
          </>
        )}
      </Flex>
    </Box>
  );
}
