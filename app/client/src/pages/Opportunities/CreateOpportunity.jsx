import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/client";
import { useColorModeValue } from "@chakra-ui/react";
import useAppToast from "../../hooks/useAppToast";

export default function CreateOpportunity() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Community");
  const [description, setDescription] = useState("");

  const toast = useAppToast();
  const navigate = useNavigate();
  const { user, createOpportunity } = useAuth();
  const pageBg = useColorModeValue("gray.50", "#0b1220");
  const cardBg = useColorModeValue("white", "#0f1c2b");
  const textPrimary = useColorModeValue("gray.800", "gray.100");
  const textMuted = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("gray.200", "rgba(255,255,255,0.12)");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.role !== "organization") {
      toast({
        title: "Organization account required",
        description:
          "Only organization accounts can create opportunities. Please sign in as an organization.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (!title || !date || !location || !description) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!user.organization_id) {
      toast({
        title: "Organization missing",
        description: "Your account is missing an organization. Please contact support.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const res = await api.post("/opportunities/", {
        title,
        description,
        location,
        category,
        start_date: new Date(date).toISOString(),
        org_id: user.organization_id,
      });
      const created = res.data?.opportunity;
      if (created) {
        // Keep dashboard in sync with the server result
        createOpportunity({
          id: created.id,
          title: created.title,
          location: created.location,
          date: created.start_date || created.created_at,
          status: created.is_active ? "Open" : "Draft",
        });
      }
      toast({
        title: "Opportunity created",
        description: "Your opportunity is now live.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/opportunities");
    } catch (err) {
      const msg = err?.response?.data?.error || "Failed to create opportunity";
      toast({
        title: "Error",
        description: msg,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box py={16} bg={pageBg} minH="calc(100vh - 160px)" color={textPrimary}>
      <Container maxW="container.md">
        <Heading mb={2}>Create New Opportunity</Heading>
        <Text mb={8} color={textMuted}>
          Fill out the details for your volunteer event. These fields match the
          opportunities shown on the public listing page.
        </Text>

        <Box
          as="form"
          onSubmit={handleSubmit}
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          p={6}
          boxShadow="sm"
        >
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="e.g. Community Food Drive"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>

            <FormControl isReadOnly>
              <FormLabel>Organization</FormLabel>
              <Input
                placeholder="Organization name"
                value={user?.organization_name || ""}
                isReadOnly
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Location</FormLabel>
              <Input
                placeholder="e.g. Boca Raton, FL"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Community">Community</option>
                <option value="Environment">Environment</option>
                <option value="Education">Education</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Describe the event, responsibilities, and who you're hoping to reach."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              mt={2}
              alignSelf="flex-start"
            >
              Create Opportunity
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
