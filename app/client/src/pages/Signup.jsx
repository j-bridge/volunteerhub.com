import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  Link,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  RadioGroup,
  Radio,
  HStack,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("volunteer"); // ⬅️ NEW: default to volunteer
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const emailValid = /^\S+@\S+\.\S+$/.test(email) || email.length === 0;
  const passwordValid = password.length >= 6 || password.length === 0;

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role) {
      toast({
        title: "Missing fields",
        description: "Please fill out name, email, password, and account type.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!emailValid || !passwordValid) {
      toast({
        title: "Fix validation errors",
        description: "Please check your email and password.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSubmitting(true);
    try {
      // ⬇️ IMPORTANT: role is now sent to backend
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role, // "volunteer" or "organization"
      });

      const data = res.data || {};

      if (res.status >= 200 && res.status < 300) {
        toast({
          title: "Signup successful!",
          description: "You can now log in.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // Clear and navigate to login
        setName("");
        setEmail("");
        setPassword("");
        setRole("volunteer");
        navigate("/login");
      } else {
        throw new Error(data?.message || "Signup failed");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to reach the server.";
      toast({
        title: "Error signing up",
        description: msg,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box py={16} bg="gray.50" minH="calc(100vh - 160px)">
      <Container maxW="container.sm">
        <Heading textAlign="center" mb={2}>
          Create an Account
        </Heading>
        <Text textAlign="center" color="gray.600" mb={8}>
          Join VolunteerHub to discover and manage opportunities.
        </Text>

        <Box
          as="form"
          onSubmit={handleSignup}
          bg="white"
          borderWidth="1px"
          borderRadius="lg"
          p={6}
          boxShadow="sm"
        >
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired isInvalid={!emailValid && email.length > 0}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="you@example.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormErrorMessage>Enter a valid email address.</FormErrorMessage>
            </FormControl>

            {/* NEW: Account type (role) selection */}
            <FormControl isRequired>
              <FormLabel>Account Type</FormLabel>
              <RadioGroup
                value={role}
                onChange={(next) => setRole(next)}
              >
                <HStack spacing={6}>
                  <Radio value="volunteer">Volunteer</Radio>
                  <Radio value="organization">Organization</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>

            <FormControl
              isRequired
              isInvalid={!passwordValid && password.length > 0}
            >
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormErrorMessage>
                Password must be at least 6 characters.
              </FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              w="100%"
              isLoading={submitting}
              loadingText="Creating account..."
            >
              Sign Up
            </Button>
          </VStack>
        </Box>

        <Text mt={4} textAlign="center">
          Already have an account?{" "}
          <Link
            as={RouterLink}
            to="/login"
            color="teal.500"
            fontWeight="semibold"
          >
            Log in
          </Link>
        </Text>
      </Container>
    </Box>
  );
}
 