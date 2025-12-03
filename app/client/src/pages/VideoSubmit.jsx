import { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function VideoSubmit() {
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [opportunityId, setOpportunityId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const titleValid = title.trim().length >= 3;
  const urlValid = /^https?:\/\//i.test(videoUrl);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titleValid || !urlValid) {
      toast({
        title: "Missing required fields",
        description: "Please provide a title and a valid video URL.",
        status: "warning",
        duration: 3500,
        isClosable: true,
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        video_url: videoUrl.trim(),
        description: description.trim() || undefined,
        opportunity_id: opportunityId ? Number(opportunityId) : undefined,
      };
      await api.post("/videos", payload);

      toast({
        title: "Submitted for review",
        description: "We received your video. An admin will review it shortly.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setTitle("");
      setVideoUrl("");
      setDescription("");
      setOpportunityId("");
      navigate("/videos");
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.details ||
        "Unable to submit video right now.";
      toast({
        title: "Submission failed",
        description: message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box bg="gray.50" minH="100vh" py={{ base: 10, md: 16 }}>
      <Container maxW="3xl">
        <Heading mb={2}>Submit a Video</Heading>
        <Text color="gray.600" mb={6}>
          Share a recording hosted on YouTube, Vimeo, or any HTTPS link. Submissions are reviewed before publishing.
        </Text>

        <Box
          as="form"
          onSubmit={handleSubmit}
          bg="white"
          p={6}
          borderRadius="lg"
          borderWidth="1px"
          shadow="sm"
        >
          <Stack spacing={4}>
            <FormControl isRequired isInvalid={!titleValid && title.length > 0}>
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="Volunteer spotlight"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <FormErrorMessage>Title must be at least 3 characters.</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!urlValid && videoUrl.length > 0}>
              <FormLabel>Video URL</FormLabel>
              <Input
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <FormErrorMessage>Enter a valid http(s) link.</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="What should viewers know about this video?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Related Opportunity ID (optional)</FormLabel>
              <NumberInput
                min={0}
                value={opportunityId}
                onChange={(value) => setOpportunityId(value)}
              >
                <NumberInputField placeholder="123" />
              </NumberInput>
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              isLoading={submitting}
              loadingText="Submitting..."
            >
              Submit for review
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
