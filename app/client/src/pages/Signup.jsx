import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  Link,
  FormControl,
  FormLabel,
  FormErrorMessage,
  RadioGroup,
  Radio,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import useAppToast from "../hooks/useAppToast";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("volunteer"); // ⬅️ NEW: default to volunteer
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const toast = useAppToast();
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

  const emailValid = /^\S+@\S+\.\S+$/.test(email) || email.length === 0;
  const passwordValid =
    password.length === 0 ||
    (password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password));

  // Preselect account type when arriving with state from the home "journey" cards
  useEffect(() => {
    const desired = location.state?.accountType;
    if (desired === "organization" || desired === "volunteer") {
      setRole(desired);
    }
  }, [location.state]);

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
        organization_name: role === "organization" ? organizationName : undefined,
      });

      const data = res.data || {};

      if (res.status >= 200 && res.status < 300) {
        const token = extractToken(data);
        if (token && data.user) {
          authLogin(token, data.user, true);
        }
        toast({
          title: "Signup successful!",
          description: "Welcome to VolunteerHub.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        const role = data?.user?.role || role || "volunteer";
        const dashboardPath =
          role === "admin"
            ? "/admin/dashboard"
            : role === "organization"
              ? "/org/dashboard"
              : "/dashboard";
        navigate(dashboardPath, { replace: true });
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
    <Box py={16} bg={pageBg} minH="calc(100vh - 160px)" color={inkText}>
      <Container maxW="container.sm">
        <Heading textAlign="center" mb={2} color={inkText}>
          Create an Account
        </Heading>
        <Text textAlign="center" color={inkMuted} mb={8}>
          Join VolunteerHub to discover and manage opportunities.
        </Text>

        <Box
          as="form"
          onSubmit={handleSignup}
          bg={cardBg}
          color={inkText}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          p={6}
          boxShadow="0 24px 60px rgba(0,0,0,0.35)"
        >
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel color={inkText}>Name</FormLabel>
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                bg={inputBg}
                color={inkText}
                borderColor={borderColor}
                _placeholder={{ color: placeholderColor }}
                _focus={{ borderColor: inkAccent, boxShadow: `0 0 0 1px ${focusShadow}` }}
              />
            </FormControl>

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
                _focus={{ borderColor: inkAccent, boxShadow: `0 0 0 1px ${focusShadow}` }}
              />
              <FormErrorMessage>Enter a valid email address.</FormErrorMessage>
            </FormControl>

            {/* NEW: Account type (role) selection */}
            <FormControl isRequired>
              <FormLabel color={inkText}>Account Type</FormLabel>
              <RadioGroup
                value={role}
                onChange={(next) => setRole(next)}
              >
                <HStack spacing={6}>
                  <Radio value="volunteer" colorScheme="teal">
                    Volunteer
                  </Radio>
                  <Radio value="organization" colorScheme="teal">
                    Organization
                  </Radio>
                </HStack>
              </RadioGroup>
            </FormControl>

            {role === "organization" && (
              <FormControl isRequired>
                <FormLabel color={inkText}>Organization Name</FormLabel>
                <Input
                  placeholder="e.g. Helping Hands Foundation"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  autoComplete="organization"
                  bg={inputBg}
                  color={inkText}
                  borderColor={borderColor}
                  _placeholder={{ color: placeholderColor }}
                  _focus={{ borderColor: inkAccent, boxShadow: `0 0 0 1px ${focusShadow}` }}
                />
              </FormControl>
            )}

            <FormControl
              isRequired
              isInvalid={!passwordValid && password.length > 0}
            >
              <FormLabel color={inkText}>Password</FormLabel>
              <Input
                type="password"
                placeholder="At least 8 characters with a number"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                bg={inputBg}
                color={inkText}
                borderColor={borderColor}
                _placeholder={{ color: placeholderColor }}
                _focus={{ borderColor: inkAccent, boxShadow: `0 0 0 1px ${focusShadow}` }}
              />
              <FormErrorMessage>
                Password must be at least 8 characters and include a number.
              </FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              bg={inkAccent}
              color={buttonText}
              _hover={{ bg: buttonHover }}
              w="100%"
              isLoading={submitting}
              loadingText="Creating account..."
            >
              Sign Up
            </Button>
          </VStack>
        </Box>

        <Text mt={4} textAlign="center" color={inkMuted}>
          Already have an account?{" "}
          <Link
            as={RouterLink}
            to="/login"
            color={inkAccent}
            fontWeight="semibold"
          >
            Log in
          </Link>
        </Text>
      </Container>
    </Box>
  );
}
 
