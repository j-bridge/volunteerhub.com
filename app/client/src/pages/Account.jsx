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
  useColorModeValue,
  Textarea,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import useAppToast from "../hooks/useAppToast";

export default function Account() {
  const toast = useAppToast();
  const { user, updateUserProfile } = useAuth();
  const [form, setForm] = useState({ name: "", email: "" });
  const [orgForm, setOrgForm] = useState({ name: "", contact_email: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingOrg, setSavingOrg] = useState(false);
  const cardBg = useColorModeValue("#ffffff", "var(--vh-ink-soft)");
  const borderColor = useColorModeValue("rgba(26,165,154,0.25)", "rgba(26,165,154,0.45)");
  const pageBg = useColorModeValue("gray.50", "#0a121a");
  const textPrimary = useColorModeValue("gray.800", "gray.100");
  const textMuted = useColorModeValue("gray.600", "gray.300");

  const loadProfile = async () => {
    try {
      const res = await api.get("/users/me");
      const u = res.data?.user || {};
      setForm({ name: u.name || "", email: u.email || "" });

      if (u.organization_id) {
        const orgRes = await api.get(`/orgs/${u.organization_id}`);
        const org = orgRes.data?.organization || {};
        setOrgForm({
          name: org.name || "",
          contact_email: org.contact_email || "",
          description: org.description || "",
        });
      }
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

  const saveOrganization = async () => {
    if (!user?.organization_id) return;
    setSavingOrg(true);
    try {
      const res = await api.patch(`/orgs/${user.organization_id}`, {
        name: orgForm.name,
        contact_email: orgForm.contact_email,
        description: orgForm.description,
      });
      const org = res.data?.organization;
      if (org) {
        updateUserProfile({
          ...user,
          organization_id: org.id,
          organization_name: org.name,
        });
      }
      toast({ title: "Organization updated", status: "success", duration: 2000, isClosable: true });
    } catch (err) {
      const msg = err?.response?.data?.error || "Could not update organization";
      toast({ title: msg, status: "error", duration: 3000, isClosable: true });
    } finally {
      setSavingOrg(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <Box bg={pageBg} minH="100vh" py={{ base: 10, md: 16 }}>
      <Container maxW="lg">
        <Stack spacing={6}>
          <Heading size="xl" color={textPrimary}>Account Settings</Heading>
          <Text color={textMuted}>Update your name and email used across VolunteerHub.</Text>

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

          {user?.role === "organization" && (
            <Box
              bg={cardBg}
              p={6}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              boxShadow="0 16px 40px rgba(0,0,0,0.08)"
            >
              <Stack spacing={4}>
                <Heading size="md">
                  Organization Profile <Badge colorScheme="teal">Owner</Badge>
                </Heading>
                <FormControl isRequired>
                  <FormLabel>Organization Name</FormLabel>
                  <Input
                    value={orgForm.name}
                    onChange={(e) => setOrgForm((f) => ({ ...f, name: e.target.value }))}
                    isDisabled={loading}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Contact Email</FormLabel>
                  <Input
                    type="email"
                    value={orgForm.contact_email}
                    onChange={(e) => setOrgForm((f) => ({ ...f, contact_email: e.target.value }))}
                    isDisabled={loading}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={orgForm.description}
                    onChange={(e) => setOrgForm((f) => ({ ...f, description: e.target.value }))}
                    rows={4}
                    isDisabled={loading}
                  />
                </FormControl>
                <Divider />
                <Button
                  colorScheme="teal"
                  onClick={saveOrganization}
                  isLoading={savingOrg}
                  isDisabled={loading}
                  alignSelf="flex-start"
                >
                  Save organization
                </Button>
              </Stack>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
