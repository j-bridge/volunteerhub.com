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
  const sectionBg = useColorModeValue("gray.50", "#0f1a21");
  const heroColor = useColorModeValue("#1aa59a", "#1aa59a"); // logo/chat accent
  const headingText = useColorModeValue("gray.800", "#e7f7f4");
  const bodyText = useColorModeValue("gray.600", "#dbe8f0"); // brighter in dark mode
  const emailColor = useColorModeValue("#0f7c70", "#7dd3fc"); // surprise color for emails

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
            <FormControl isRequired>
              <FormLabel color={headingText}>Name</FormLabel>
              <Input placeholder="Your name" name="name" autoComplete="name" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={headingText}>Email</FormLabel>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </FormControl>

            <FormControl>
              <FormLabel color={headingText}>Organization (optional)</FormLabel>
              <Input
                name="organization"
                placeholder="Nonprofit, school, club, etc."
                autoComplete="organization"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={headingText}>Message</FormLabel>
              <Textarea
                name="message"
                rows={5}
                placeholder="How can we help?"
                autoComplete="off"
              />
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
