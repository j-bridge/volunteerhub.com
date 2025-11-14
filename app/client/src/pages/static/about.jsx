import {
  Container,
  Heading,
  Text,
  SimpleGrid,
  Box,
  Stack,
  Badge,
} from "@chakra-ui/react";

export default function About() {
  return (
    <Container maxW="6xl" py={10}>
      <Stack spacing={8}>
        <Heading size="2xl">VolunteerHub</Heading>
        <Text fontSize="lg" color="gray.600">
          VolunteerHub connects passionate volunteers with mission-driven
          nonprofits. We help organizations publish opportunities and review
          applicants while giving volunteers a modern way to discover, apply,
          and track their impact.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          <Box p={6} rounded="2xl" shadow="md" bg="white">
            <Heading size="md" mb={2}>For Volunteers</Heading>
            <Text color="gray.600">
              Browse, filter, and apply to opportunities that match your skills
              and availability.
            </Text>
          </Box>

          <Box p={6} rounded="2xl" shadow="md" bg="white">
            <Heading size="md" mb={2}>For Nonprofits</Heading>
            <Text color="gray.600">
              Publish roles, manage applicants, and collaborate with your team.
            </Text>
          </Box>

          <Box p={6} rounded="2xl" shadow="md" bg="white">
            <Heading size="md" mb={2}>For Admins</Heading>
            <Text color="gray.600">
              Role-aware moderation and analytics keep the platform healthy.
            </Text>
          </Box>
        </SimpleGrid>

        <Box p={6} rounded="2xl" shadow="sm" bg="white">
          <Heading size="md" mb={3}>The Team</Heading>
          <Stack direction={{ base: "column", md: "row" }} spacing={4}>
            <Badge colorScheme="teal">Jeremiah — Backend/API</Badge>
            <Badge colorScheme="purple">Chandler — Data & Infra</Badge>
            <Badge colorScheme="blue">Nadina — Frontend & UX</Badge>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
