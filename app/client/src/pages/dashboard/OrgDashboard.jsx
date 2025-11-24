import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Button,
  Badge,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // ⬅️ NEW

// Later, you could filter real org-owned opportunities from the backend.
const orgEvents = [
  {
    id: "evt1",
    title: "Community Food Drive",
    date: "2025-11-20",
    status: "Open",
    location: "Boca Raton, FL",
  },
  {
    id: "evt2",
    title: "Holiday Toy Sorting",
    date: "2025-12-05",
    status: "Open",
    location: "Boca Raton, FL",
  },
  {
    id: "evt3",
    title: "Volunteer Orientation Night",
    date: "2025-11-28",
    status: "Draft",
    location: "Online",
  },
];

export default function OrgDashboard() {
  const navigate = useNavigate(); // ⬅️ NEW

  return (
    <Container maxW="6xl" py={10}>
      <Stack spacing={8}>
        <Heading size="2xl">Organization Dashboard</Heading>

        {/* Top actions */}
        <Box
          p={6}
          bg="white"
          rounded="2xl"
          shadow="md"
          borderWidth="1px"
        >
          <Heading size="md" mb={2}>
            Manage Opportunities
          </Heading>
          <Text color="gray.600" mb={4}>
            View your current volunteer events and create new ones to post to the community.
          </Text>
          <Button
            colorScheme="teal"
            onClick={() => navigate("/org/opportunities/new")} // ⬅️ NEW
          >
            Create New Opportunity
          </Button>
          {/* Later: navigate to /org/opportunities/new or open a form modal */}
        </Box>

        {/* Current events */}
        <Box>
          <Heading size="lg" mb={4}>
            Current Events
          </Heading>
          {orgEvents.length === 0 ? (
            <Text color="gray.600">
              You don&apos;t have any posted events yet. Create your first opportunity above.
            </Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              {orgEvents.map((evt) => (
                <Box
                  key={evt.id}
                  p={4}
                  bg="white"
                  rounded="xl"
                  shadow="sm"
                  borderWidth="1px"
                >
                  <Heading size="sm" mb={1}>
                    {evt.title}
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    {evt.location}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(evt.date).toLocaleDateString()}
                  </Text>
                  <Badge
                    mt={2}
                    colorScheme={evt.status === "Open" ? "green" : "yellow"}
                  >
                    {evt.status}
                  </Badge>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Stack>
    </Container>
  );
}
