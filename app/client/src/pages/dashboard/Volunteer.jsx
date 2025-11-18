// app/client/src/pages/dashboard/Volunteer.jsx
import {
  Container,
  Heading,
  Stack,
  SimpleGrid,
  Box,
  Text,
  Button,
} from "@chakra-ui/react";

export default function VolunteerDashboard() {
  return (
    <Container maxW="6xl" py={10}>
      <Stack spacing={8}>
        {/* Page title */}
        <Heading size="2xl">My Dashboard</Heading>

        {/* Three main sections */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          {/* My Applications */}
          <Box p={6} bg="white" rounded="2xl" shadow="md">
            <Heading size="md" mb={2}>
              My Applications
            </Heading>
            <Text color="gray.600">
              You haven&apos;t applied to any opportunities yet.
            </Text>
            <Button mt={4} variant="outline" as="a" href="/opportunities">
              Find Opportunities
            </Button>
          </Box>

          {/* Saved Opportunities */}
          <Box p={6} bg="white" rounded="2xl" shadow="md">
            <Heading size="md" mb={2}>
              Saved Opportunities
            </Heading>
            <Text color="gray.600">
              Save roles you&apos;re interested in and they&apos;ll show up here.
            </Text>
          </Box>

          {/* Recommended Opportunities */}
          <Box p={6} bg="white" rounded="2xl" shadow="md">
            <Heading size="md" mb={2}>
              Recommended Opportunities
            </Heading>
            <Text color="gray.600">
              Once recommendations are set up, personalized suggestions will
              appear here.
            </Text>
          </Box>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}