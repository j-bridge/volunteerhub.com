// app/client/src/pages/static/Contact.jsx

import React from "react";
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
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

const Contact = () => {
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const sectionBg = useColorModeValue("gray.50", "gray.900");

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "We'll get back to you soon!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box py={{ base: 10, md: 16 }} px={{ base: 4, md: 10 }} maxW="6xl" mx="auto">
      
      {/* Header */}
      <Stack spacing={4} mb={10}>
        <Heading size="2xl">Contact Us</Heading>
        <Text fontSize="lg" color="gray.600">
          Have questions, want to partner with us, or need support? Send us a message.
        </Text>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>

        {/* Left: Info */}
        <Stack spacing={6}>
          <Box bg={sectionBg} p={6} borderRadius="2xl">
            <Heading size="sm" mb={2}>General Questions</Heading>
            <Text fontSize="sm" color="gray.600" mb={2}>
              For volunteer help or platform questions:
            </Text>
            <Text fontWeight="medium">support@volunteerhub.com</Text>
          </Box>

          <Box bg={sectionBg} p={6} borderRadius="2xl">
            <Heading size="sm" mb={2}>Organizations</Heading>
            <Text fontSize="sm" color="gray.600" mb={2}>
              Want to post opportunities or collaborate?
            </Text>
            <Text fontWeight="medium">partners@volunteerhub.com</Text>
          </Box>

          <Box bg={sectionBg} p={6} borderRadius="2xl">
            <Heading size="sm" mb={2}>Feedback</Heading>
            <Text fontSize="sm" color="gray.600">
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
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input placeholder="Your name" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="you@example.com" />
            </FormControl>

            <FormControl>
              <FormLabel>Organization (optional)</FormLabel>
              <Input placeholder="Nonprofit, school, club, etc." />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Message</FormLabel>
              <Textarea rows={5} placeholder="How can we help?" />
            </FormControl>

            <Button type="submit" mt={2}>
              Send Message
            </Button>
          </Stack>
        </Box>

      </SimpleGrid>
    </Box>
  );
};

export default Contact;
