
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
  useColorModeValue,
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
  const pageBg = useColorModeValue(
    "linear-gradient(135deg, #f5f1e8, #ede8de)",
    "radial-gradient(120% 120% at 10% 20%, rgba(24,178,165,0.18), transparent 45%), linear-gradient(145deg, #0b1f24, #08141a)"
  );
  const cardBg = useColorModeValue("#ffffff", "var(--vh-ink-soft)");
  const inputBg = useColorModeValue("#ffffff", "#0b1f24");
  const inkAccent = useColorModeValue("#1aa59a", "#0f6c5f");
  const inkText = useColorModeValue("#1f262a", "var(--vh-ink-text)");
  const inkMuted = useColorModeValue("#4a5561", "var(--vh-ink-muted)");
  const borderColor = useColorModeValue("rgba(26,165,154,0.25)", "rgba(15,108,95,0.45)");
  const placeholderColor = useColorModeValue("#5b6571", "rgba(231,247,244,0.7)");
  const focusShadow = useColorModeValue("rgba(26,165,154,0.6)", "rgba(15,108,95,0.6)");
  const buttonText = useColorModeValue("#0f252b", "#0b1618");
  const buttonHover = useColorModeValue("#1fb9ae", "#0f7c70");


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

  const extractToken = (data) => {
    if (!data) return null;
    if (data.access_token) return data.access_token;
    if (data.token) return data.token;
    if (data.tokens?.access_token) return data.tokens.access_token;
    if (data.data?.access_token) return data.data.access_token;
    if (data.data?.token) return data.data.token;
    if (data.data?.tokens?.access_token) return data.data.tokens.access_token;
    return null;
  };

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
      const resp = err?.response?.data || {};
      const msg =
        resp.message ||
        resp.error ||
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
    <Box py={16} bg={pageBg} minH="calc(100vh - 160px)" color={inkText}>
      <Container maxW="container.sm">
        <Heading textAlign="center" mb={2} color={inkText}>
          Log In
        </Heading>
        <Text textAlign="center" color={inkMuted} mb={8}>
          Access your VolunteerHub account.
        </Text>

        <Box
          as="form"
          onSubmit={handleLogin}
          bg={cardBg}
          color={inkText}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          p={6}
          boxShadow="0 24px 60px rgba(0,0,0,0.35)"
        >
          <VStack spacing={4} align="stretch">
            <FormControl isRequired isInvalid={!emailValid && email.length > 0}>
              <FormLabel color={inkText}>Email</FormLabel>
              <Input
                type="email"
                placeholder="you@example.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                bg={inputBg}
                color={inkText}
                borderColor={borderColor}
                _placeholder={{ color: placeholderColor }}
                _focus={{
                  borderColor: inkAccent,
                  boxShadow: `0 0 0 1px ${focusShadow}`,
                }}
              />
              <FormErrorMessage>Enter a valid email address.</FormErrorMessage>
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={inkText}>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  bg={inputBg}
                  color={inkText}
                  borderColor={borderColor}
                  _placeholder={{ color: placeholderColor }}
                  _focus={{
                    borderColor: inkAccent,
                    boxShadow: `0 0 0 1px ${focusShadow}`,
                  }}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    variant="ghost"
                    color={inkText}
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
                colorScheme="teal"
                color={inkText}
              >
                Remember me
              </Checkbox>
              <Link as={RouterLink} to="/reset" color={inkAccent} fontSize="sm" fontWeight="semibold">
                Forgot password?
              </Link>
            </HStack>

            <Button
              type="submit"
              bg={inkAccent}
              color={buttonText}
              _hover={{ bg: buttonHover }}
              w="100%"
              isLoading={submitting}
              loadingText="Signing in..."
            >
              Log In
            </Button>
          </VStack>
        </Box>

        <Text mt={4} textAlign="center" color={inkMuted}>
          Don’t have an account?{" "}
          <Link as={RouterLink} to="/signup" color={inkAccent} fontWeight="semibold">
            Sign up
          </Link>
        </Text>
      </Container>
    </Box>
  );
}
