import {
  Container,
  Heading,
  Stack,
  SimpleGrid,
  Box,
  Text,
  Button,
  Badge,
} from "@chakra-ui/react";
import { opportunities } from "../../mock/opportunities";
import { useNavigate } from "react-router-dom";

export default function VolunteerDashboard() {
  const navigate = useNavigate();

  const upcoming = opportunities.slice(0, 3); // simple subset for now

  return (
    <Container maxW="6xl" py={10}>
      <Stack spacing={8}>
        <Heading size="2xl">My Dashboard</Heading>

        {/* Quick actions / overview */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          <Box p={6} bg="white" rounded="2xl" shadow="md">
            <Heading size="md" mb={2}>
              My Applications
            </Heading>
            <Text color="gray.600">
              You haven&apos;t applied to any opportunities yet.
            </Text>
            <Button mt={4} variant="outline" onClick={() => navigate("/opportunities")}>
              Find Opportunities
            </Button>
          </Box>

          <Box p={6} bg="white" rounded="2xl" shadow="md">
            <Heading size="md" mb={2}>
              Saved Opportunities
            </Heading>
            <Text color="gray.600">
              Save roles you&apos;re interested in and they&apos;ll show up here.
            </Text>
          </Box>

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

        {/* Upcoming opportunities list */}
        <Box mt={4}>
          <Heading size="lg" mb={4}>
            Upcoming Opportunities
          </Heading>
          {upcoming.length === 0 ? (
            <Text color="gray.600">
              No upcoming opportunities yet. Check the opportunities page to explore more.
            </Text>
          ) : (
            <Stack spacing={3}>
              {upcoming.map((opp) => (
                <Box
                  key={opp.id}
                  p={4}
                  bg="white"
                  rounded="xl"
                  shadow="sm"
                  borderWidth="1px"
                >
                  <Heading size="sm" mb={1}>
                    {opp.title}
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    {opp.organization} • {opp.location}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(opp.date).toLocaleDateString()}
                  </Text>
                  {opp.category && (
                    <Badge mt={2} variant="subtle">
                      {opp.category}
                    </Badge>
                  )}
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </Container>
  );
}

