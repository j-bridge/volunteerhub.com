
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
  HStack,
  Checkbox,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const location = useLocation();

useEffect(() => {
  if (location.state?.fromApply) {
    toast({
      title: "Log in required to apply",
      description:
        "Please log in or sign up as a volunteer to apply for this opportunity.",
      status: "info",
      duration: 4000,
      isClosable: true,
    });

    // Clear the state so the toast doesn't repeat on back/forward
    navigate(location.pathname, { replace: true });
  }
}, [location.state, location.pathname, navigate, toast]);


  const emailValid = /^\S+@\S+\.\S+$/.test(email) || email.length === 0;

  const extractToken = (data) =>
    data?.access_token ||
    data?.token ||
    data?.data?.access_token ||
    data?.data?.token ||
    null;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter your email and password.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!emailValid) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res.data || {};
      const token = extractToken(data);

      if (res.status >= 200 && res.status < 300) {
        if (token) authLogin(token, data?.user, remember);
        toast({
          title: "Welcome back!",
          status: "success",
          duration: 1800,
          isClosable: true,
        });
        navigate("/");
      } else {
        throw new Error(data?.message || "Login failed");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to reach the server.";
      toast({
        title: "Login failed",
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
          Log In
        </Heading>
        <Text textAlign="center" color="gray.600" mb={8}>
          Access your VolunteerHub account.
        </Text>

        <Box
          as="form"
          onSubmit={handleLogin}
          bg="white"
          borderWidth="1px"
          borderRadius="lg"
          p={6}
          boxShadow="sm"
        >
          <VStack spacing={4} align="stretch">
            <FormControl isRequired isInvalid={!emailValid && email.length > 0}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="you@example.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <FormErrorMessage>Enter a valid email address.</FormErrorMessage>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPw((s) => !s)}
                  >
                    {showPw ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <HStack justify="space-between">
              <Checkbox
                isChecked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              >
                Remember me
              </Checkbox>
              <Link as={RouterLink} to="/reset" color="teal.500" fontSize="sm">
                Forgot password?
              </Link>
            </HStack>

            <Button
              type="submit"
              colorScheme="teal"
              w="100%"
              isLoading={submitting}
              loadingText="Signing in..."
            >
              Log In
            </Button>
          </VStack>
        </Box>

        <Text mt={4} textAlign="center">
          Don’t have an account?{" "}
          <Link as={RouterLink} to="/signup" color="teal.500" fontWeight="semibold">
            Sign up
          </Link>
        </Text>
      </Container>
    </Box>
  );
}
