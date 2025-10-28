import { Box, Flex, HStack, Link, Button, Spacer, Text } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box as="nav" w="100%" bg="white" boxShadow="sm" px={8} py={4} position="sticky" top="0" zIndex="1000">
      <Flex align="center">
        {/* Logo acts as Home */}
        <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
          <Text fontSize="xl" fontWeight="bold" color="teal.500">
            VolunteerHub
          </Text>
        </Link>

        <Spacer />

        {/* Primary nav links (hide "Home") */}
        <HStack spacing={6} display={{ base: "none", md: "flex" }}>
          <Link as={RouterLink} to="/opportunities" fontWeight="500">Opportunities</Link>
          <Link as={RouterLink} to="/about" fontWeight="500">About</Link>
          <Link as={RouterLink} to="/contact" fontWeight="500">Contact</Link>
        </HStack>

        <Spacer />

        {/* Auth-aware actions */}
        {user ? (
          <HStack spacing={4}>
            <Text fontSize="sm" color="gray.600">Hello, {user?.name || user?.email || "Volunteer"}</Text>
            <Button onClick={handleLogout} colorScheme="teal" variant="outline" size="sm">
              Log out
            </Button>
          </HStack>
        ) : (
          <HStack spacing={4}>
            <Button as={RouterLink} to="/login" colorScheme="teal" variant="outline" size="sm">
              Log In
            </Button>
            <Button as={RouterLink} to="/signup" colorScheme="teal" size="sm">
              Sign Up
            </Button>
          </HStack>
        )}
      </Flex>
    </Box>
  );
}