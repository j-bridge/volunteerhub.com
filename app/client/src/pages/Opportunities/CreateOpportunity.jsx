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
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function CreateOpportunity() {
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Community");
  const [description, setDescription] = useState("");

  const toast = useToast();
  const navigate = useNavigate();

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

    // 💡 Frontend-only for now — this is where a POST /opportunities call will go later.
    const payload = {
      title,
      organization,
      date,
      location,
      category,
      description,
    };

    console.log("Create opportunity (mock):", payload);

    toast({
      title: "Opportunity created (mock)",
      description: "Backend integration will save this in a later phase.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // For now, send them back to the org dashboard
    navigate("/org/dashboard");
  };

  return (
    <Box py={16} bg="gray.50" minH="calc(100vh - 160px)">
      <Container maxW="container.md">
        <Heading mb={2}>Create New Opportunity</Heading>
        <Text mb={8} color="gray.600">
          Fill out the details for your volunteer event. These fields match the
          opportunities shown on the public listing page.
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
                {/* Add more later if needed */}
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
