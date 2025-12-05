// app/client/src/pages/static/Contact.jsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import useAppToast from "../../hooks/useAppToast";

const Contact = () => {
  const toast = useAppToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const sectionBg = useColorModeValue("gray.50", "#0f1a21");
  const heroColor = useColorModeValue("#1aa59a", "#1aa59a"); // logo/chat accent
  const headingText = useColorModeValue("gray.800", "#e7f7f4");
  const bodyText = useColorModeValue("gray.600", "#dbe8f0"); // brighter in dark mode
  const emailColor = useColorModeValue("#0f7c70", "#7dd3fc"); // surprise color for emails
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", organization: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Prefill from logged-in user
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      name: f.name || user.name || "",
      email: f.email || user.email || "",
      organization: f.organization || user.organization_name || "",
    }));
  }, [user]);

  const destination =
    !user
      ? "/"
      : user.role === "organization"
        ? "/org/dashboard"
        : user.role === "admin"
          ? "/admin/dashboard"
          : "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedMessage = form.message.trim();
    const emailValid = /^\S+@\S+\.\S+$/.test(trimmedEmail);

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      toast({
        title: "Missing fields",
        description: "Please fill in your name, email, and message.",
        status: "warning",
      });
      return;
    }
    if (!emailValid) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        status: "error",
      });
      return;
    }
    if (trimmedMessage.length < 5) {
      toast({
        title: "Message too short",
        description: "Please provide a bit more detail in your message.",
        status: "warning",
      });
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/contact", {
        name: trimmedName,
        email: trimmedEmail,
        organization: form.organization || undefined,
        message: trimmedMessage,
      });
      setSubmitted(true);
      toast({
        title: "We received your inquiry",
        description: "Thanks for reaching out. We’ll follow up soon.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => navigate(destination), 1200);
    } catch (err) {
      const msg = err?.response?.data?.error || "Could not send your message";
      toast({
        title: msg,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box py={{ base: 10, md: 16 }} px={{ base: 4, md: 10 }} maxW="6xl" mx="auto">
      
      {/* Header */}
      <Stack spacing={4} mb={10}>
        <Heading size="2xl" color={heroColor}>Contact Us</Heading>
        <Text fontSize="lg" color={bodyText}>
          Have questions, want to partner with us, or need support? Send us a message.
        </Text>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>

        {/* Left: Info */}
        <Stack spacing={6}>
          <Box bg={sectionBg} p={6} borderRadius="2xl">
            <Heading size="sm" mb={2} color={heroColor}>General Questions</Heading>
            <Text fontSize="sm" color={bodyText} mb={2}>
              For volunteer help or platform questions:
            </Text>
            <Text fontWeight="semibold" color={emailColor}>volunteersupport@jbridgewater.com</Text>
          </Box>

          <Box bg={sectionBg} p={6} borderRadius="2xl">
            <Heading size="sm" mb={2} color={heroColor}>Organizations</Heading>
            <Text fontSize="sm" color={bodyText} mb={2}>
              Want to post opportunities or collaborate?
            </Text>
            <Text fontWeight="semibold" color={emailColor}>volunteerpartners@jbridgewater.com</Text>
          </Box>

          <Box bg={sectionBg} p={6} borderRadius="2xl">
            <Heading size="sm" mb={2} color={heroColor}>Feedback</Heading>
            <Text fontSize="sm" color={bodyText}>
              Found a bug or suggestion? Tell us!
            </Text>
          </Box>
        </Stack>

        {/* Right: Form */}
        <Box
          bg={cardBg}
          p={6}
          borderRadius="2xl"
          boxShadow="sm"
          as="form"
          onSubmit={handleSubmit}
        >
          <Stack spacing={4}>
            {submitted && (
              <Box
                bg={sectionBg}
                borderRadius="lg"
                p={4}
                border="1px solid"
                borderColor="rgba(26,165,154,0.35)"
              >
                <Heading size="sm" color={heroColor} mb={1}>Message submitted</Heading>
                <Text fontSize="sm" color={bodyText}>
                  We received your inquiry and emailed a confirmation. We’ll follow up soon.
                </Text>
              </Box>
            )}
            <FormControl isRequired>
              <FormLabel color={headingText}>Name</FormLabel>
              <Input
                placeholder="Your name"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                isDisabled={submitting}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={headingText}>Email</FormLabel>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                isDisabled={submitting}
              />
            </FormControl>

            <FormControl>
              <FormLabel color={headingText}>Organization (optional)</FormLabel>
              <Input
                name="organization"
                placeholder="Nonprofit, school, club, etc."
                autoComplete="organization"
                value={form.organization}
                onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))}
                isDisabled={submitting}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={headingText}>Message</FormLabel>
              <Textarea
                name="message"
                rows={5}
                placeholder="How can we help?"
                autoComplete="off"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                isDisabled={submitting}
              />
            </FormControl>

            <Button type="submit" mt={2} colorScheme="teal" isLoading={submitting} isDisabled={submitting}>
              {submitting ? "Sending..." : "Send Message"}
            </Button>
          </Stack>
        </Box>

      </SimpleGrid>
    </Box>
  );
};

export default Contact;
