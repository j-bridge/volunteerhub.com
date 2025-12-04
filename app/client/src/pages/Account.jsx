import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Account() {
  const toast = useToast();
  const { user, updateUserProfile } = useAuth();
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const cardBg = useColorModeValue("#ffffff", "var(--vh-ink-soft)");
  const borderColor = useColorModeValue("rgba(26,165,154,0.25)", "rgba(26,165,154,0.45)");

  const loadProfile = async () => {
    try {
      const res = await api.get("/users/me");
      const u = res.data?.user || {};
      setForm({ name: u.name || "", email: u.email || "" });
    } catch (err) {
      toast({
        title: "Could not load profile",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch("/users/me", { name: form.name, email: form.email });
      const updated = res.data?.user;
      updateUserProfile(updated);
      toast({ title: "Profile updated", status: "success", duration: 2000, isClosable: true });
    } catch (err) {
      const msg = err?.response?.data?.error || "Could not update profile";
      toast({ title: msg, status: "error", duration: 3000, isClosable: true });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <Box bg="gray.50" minH="100vh" py={{ base: 10, md: 16 }}>
      <Container maxW="lg">
        <Stack spacing={6}>
          <Heading size="xl">Account Settings</Heading>
          <Text color="gray.600">Update your name and email used across VolunteerHub.</Text>

          <Box
            as="form"
            onSubmit={saveProfile}
            bg={cardBg}
            p={6}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            boxShadow="0 16px 40px rgba(0,0,0,0.08)"
          >
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  isDisabled={loading}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  isDisabled={loading}
                />
              </FormControl>
              <Button colorScheme="teal" type="submit" isLoading={saving} isDisabled={loading}>
                Save changes
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
