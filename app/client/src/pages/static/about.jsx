// app/client/src/pages/static/About.jsx

import {
  Box,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  HStack,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";


const About = () => {
  const cardBg = useColorModeValue("white", "gray.800");
  const sectionBg = useColorModeValue("gray.50", "gray.900");

  return (
    <Box py={{ base: 10, md: 16 }} px={{ base: 4, md: 10 }} maxW="6xl" mx="auto">
      
      {/* Header */}
      <Stack spacing={6} mb={12}>
        <Heading size="2xl">About VolunteerHub</Heading>
        <Text fontSize="lg" color="gray.600">
          VolunteerHub connects students and community members with
          organizations that need volunteers. Our mission is to make community
          impact simple, accessible, and meaningful.
        </Text>
      </Stack>

      {/* Mission / Who We Serve */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mb={16}>

        <Box>
          <Heading size="md" mb={4}>Our Mission</Heading>
          <Text color="gray.600" mb={3}>
            VolunteerHub was created because finding volunteer opportunities was
            too scattered across flyers, group chats, and random websites.
          </Text>
          <Text color="gray.600">
            We solve this by bringing everything into one clean, centralized
            platform—so organizations can share events, and volunteers can sign
            up with ease.
          </Text>
        </Box>

        <Box bg={sectionBg} borderRadius="2xl" p={6}>
          <Heading size="sm" mb={4}>Who We Serve</Heading>
          <Stack spacing={4}>
            <HStack align="flex-start">
              <Box>
                <Text fontWeight="semibold">Volunteers</Text>
                <Text fontSize="sm" color="gray.600">
                  Students and community members looking to give back.
                </Text>
              </Box>
            </HStack>

            <HStack align="flex-start">
              <Box>
                <Text fontWeight="semibold">Nonprofits</Text>
                <Text fontSize="sm" color="gray.600">
                  Community partners needing help for events, drives, and programs.
                </Text>
              </Box>
            </HStack>

            <HStack align="flex-start">
              <Box>
                <Text fontWeight="semibold">Campus Organizations</Text>
                <Text fontSize="sm" color="gray.600">
                  Departments and clubs coordinating service initiatives.
                </Text>
              </Box>
            </HStack>
          </Stack>
        </Box>

      </SimpleGrid>

      {/* How it Works */}
      <Box mb={16}>
        <Heading size="md" mb={6}>How It Works</Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="sm">
            <Heading size="sm" mb={2}>1. Explore</Heading>
            <Text fontSize="sm" color="gray.600">
              Browse events by cause, date, skills, and location.
            </Text>
          </Box>

          <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="sm">
            <Heading size="sm" mb={2}>2. Sign Up</Heading>
            <Text fontSize="sm" color="gray.600">
              View details and register with one click.
            </Text>
          </Box>

          <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="sm">
            <Heading size="sm" mb={2}>3. Make an Impact</Heading>
            <Text fontSize="sm" color="gray.600">
              Track your volunteer participation and stay involved.
            </Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Team */}
      <Box>
        <Heading size="md" mb={6}>Meet the Team</Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <Stack align="center">
            <Avatar size="xl" name="Team Member 1" />
            <Text fontWeight="semibold">Team Member 1</Text>
            <Text fontSize="sm" color="gray.600">Developer</Text>
          </Stack>

          <Stack align="center">
            <Avatar size="xl" name="Team Member 2" />
            <Text fontWeight="semibold">Team Member 2</Text>
            <Text fontSize="sm" color="gray.600">Designer</Text>
          </Stack>

          <Stack align="center">
            <Avatar size="xl" name="Team Member 3" />
            <Text fontWeight="semibold">Team Member 3</Text>
            <Text fontSize="sm" color="gray.600">Project Lead</Text>
          </Stack>
        </SimpleGrid>

        <Text mt={6} fontSize="sm" color="gray.500">
          Customize names, photos, and roles based on your project group.
        </Text>
      </Box>
    </Box>
  );
};

export default About;
