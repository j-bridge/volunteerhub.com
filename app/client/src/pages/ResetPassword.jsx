import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Stack,
  Text,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import useAppToast from "../hooks/useAppToast";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const isResetMode = useMemo(() => Boolean(token), [token]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const toast = useAppToast();
  const navigate = useNavigate();

  const pageBg = useColorModeValue(
    "linear-gradient(135deg, #f5f1e8, #ede8de)",
    "radial-gradient(120% 120% at 10% 20%, rgba(24,178,165,0.18), transparent 45%), linear-gradient(145deg, #0b1f24, #08141a)"
  );
  const cardBg = useColorModeValue("#ffffff", "var(--vh-ink-soft)");
  const textPrimary = useColorModeValue("#1f262a", "var(--vh-ink-text)");
  const textMuted = useColorModeValue("#4a5561", "var(--vh-ink-muted)");
  const borderColor = useColorModeValue("rgba(26,165,154,0.25)", "rgba(15,108,95,0.45)");
  const inputBg = useColorModeValue("#ffffff", "#0b1f24");
  const inkAccent = useColorModeValue("#1aa59a", "#0f6c5f");
  const placeholderColor = useColorModeValue("#5b6571", "rgba(231,247,244,0.7)");

  useEffect(() => {
    if (isResetMode) {
      toast({
        title: "Set a new password",
        description: "Enter a strong password to secure your account.",
        status: "info",
        duration: 3500,
        isClosable: true,
      });
    }
  }, [isResetMode, toast]);

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Email required", status: "warning", duration: 2500, isClosable: true });
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/auth/forgot", { email });
      toast({
        title: "Request received",
        description: "If that account exists, a reset link was emailed.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      const msg = err?.response?.data?.error || "Could not send reset link";
      toast({ title: msg, status: "error", duration: 3000, isClosable: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!password || !password2) {
      toast({ title: "Password required", status: "warning", duration: 2500, isClosable: true });
      return;
    }
    if (password !== password2) {
      toast({ title: "Passwords do not match", status: "error", duration: 2500, isClosable: true });
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/auth/reset", { token, password });
      toast({ title: "Password updated", status: "success", duration: 3000, isClosable: true });
      navigate("/login", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.error || "Reset failed";
      toast({ title: msg, status: "error", duration: 3000, isClosable: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box py={16} bg={pageBg} minH="calc(100vh - 160px)">
      <Container maxW="container.sm">
        <Stack spacing={3} textAlign="center" mb={4}>
          <Heading color={textPrimary}>{isResetMode ? "Reset Password" : "Forgot Password"}</Heading>
          <Text color={textMuted}>
            {isResetMode
              ? "Enter a new password to regain access to your account."
              : "Send yourself a secure link to reset your password."}
          </Text>
        </Stack>

        <Box
          as="form"
          onSubmit={isResetMode ? handleReset : handleRequest}
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          p={6}
          boxShadow="0 24px 60px rgba(0,0,0,0.35)"
        >
          <Stack spacing={4}>
            {!isResetMode && (
              <FormControl isRequired>
                <FormLabel color={textPrimary}>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.org"
                  bg={inputBg}
                  borderColor={borderColor}
                  _placeholder={{ color: placeholderColor }}
                />
              </FormControl>
            )}

            {isResetMode && (
              <>
                <FormControl isRequired>
                  <FormLabel color={textPrimary}>New Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a strong password"
                    bg={inputBg}
                    borderColor={borderColor}
                    _placeholder={{ color: placeholderColor }}
                  />
                </FormControl>
                <FormControl isRequired isInvalid={password2.length > 0 && password !== password2}>
                  <FormLabel color={textPrimary}>Confirm Password</FormLabel>
                  <Input
                    type="password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    placeholder="Re-enter password"
                    bg={inputBg}
                    borderColor={borderColor}
                    _placeholder={{ color: placeholderColor }}
                  />
                  <FormErrorMessage>Passwords must match.</FormErrorMessage>
                </FormControl>
              </>
            )}

            <Button
              type="submit"
              colorScheme="teal"
              isLoading={submitting}
              loadingText={isResetMode ? "Updating" : "Sending"}
              alignSelf="flex-start"
            >
              {isResetMode ? "Update password" : "Send reset link"}
            </Button>
          </Stack>
        </Box>

        <Text mt={4} textAlign="center" color={textMuted}>
          Remembered it?{" "}
          <Link as={RouterLink} to="/login" color={inkAccent} fontWeight="semibold">
            Go back to login
          </Link>
        </Text>
      </Container>
    </Box>
  );
}
