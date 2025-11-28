import { useEffect, useState } from "react";
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
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function EditOpportunity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, updateCreatedOpportunity } = useAuth();

  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Community");
  const [description, setDescription] = useState("");

  const created = user?.createdOpportunities || [];
  const existing = created.find((o) => String(o.id) === String(id));

  useEffect(() => {
    if (!existing) {
      setLoaded(true);
      return;
    }

    setTitle(existing.title || "");
    setOrganization(existing.organization || "");
    setDate(existing.date || "");
    setLocation(existing.location || "");
    setCategory(existing.category || "Community");
    setDescription(existing.description || "");
    setLoaded(true);
  }, [existing]);

  if (!loaded) {
    // small loading state
    return (
      <Box py={16} bg="gray.50" minH="calc(100vh - 160px)">
        <Container maxW="container.md">
          <Text>Loading opportunity...</Text>
        </Container>
      </Box>
    );
  }

  if (!existing) {
    // no such opp in this org's local state
    return (
      <Box py={16} bg="gray.50" minH="calc(100vh - 160px)">
        <Container maxW="container.md">
          <Heading mb={3}>Opportunity not found</Heading>
          <Text mb={6} color="gray.600">
            We couldn&apos;t find this opportunity in your created list. It may
            have been removed.
          </Text>
          <Button onClick={() => navigate("/org/dashboard")} colorScheme="teal">
            Back to dashboard
          </Button>
        </Container>
      </Box>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !organization || !date || !location || !description) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    updateCreatedOpportunity(id, {
      title,
      organization,
      date,
      location,
      category,
      description,
    });

    toast({
      title: "Opportunity updated",
      description: "Your changes have been saved locally.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    navigate("/org/dashboard");
  };

  return (
    <Box py={16} bg="gray.50" minH="calc(100vh - 160px)">
      <Container maxW="container.md">
        <Heading mb={2}>Edit Opportunity</Heading>
        <Text mb={8} color="gray.600">
          Update the details of your volunteer event. This uses the same fields
          as the create form.
        </Text>

        <Box
          as="form"
          onSubmit={handleSubmit}
          bg="white"
          borderWidth="1px"
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

            <FormControl isRequired>
              <FormLabel>Organization</FormLabel>
              <Input
                placeholder="e.g. Helping Hands Foundation"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
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
              Save Changes
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
