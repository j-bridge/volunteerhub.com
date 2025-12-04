import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Button,
  Badge,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function OrgDashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, deleteCreatedOpportunity } = useAuth();
  const cardBg = useColorModeValue("white", "var(--vh-ink-soft)");
  const panelBg = useColorModeValue("white", "#0b1f24");
  const textPrimary = useColorModeValue("#1f262a", "var(--vh-ink-text)");
  const textMuted = useColorModeValue("#4a5561", "rgba(231,247,244,0.72)");
  const borderColor = useColorModeValue("rgba(26,165,154,0.25)", "rgba(26,165,154,0.4)");

  const orgEvents = user?.createdOpportunities || [];

  const handleEdit = (evt) => {
    // Go to a dedicated edit page with the same form UI as "Create"
    navigate(`/org/opportunities/${evt.id}/edit`);
  };

  const handleDelete = (id) => {
    const ok = window.confirm(
      "Delete this opportunity? This cannot be undone."
    );
    if (!ok) return;

    deleteCreatedOpportunity(id);

    toast({
      title: "Opportunity deleted",
      status: "info",
      duration: 2500,
      isClosable: true,
    });
  };

  return (
    <Container maxW="6xl" py={10}>
      <Stack spacing={8}>
        <Heading size="2xl" color={textPrimary}>Organization Dashboard</Heading>

        {/* Top actions */}
        <Box p={6} bg={cardBg} rounded="2xl" shadow="md" border={`1px solid ${borderColor}`}>
          <Heading size="md" mb={2} color={textPrimary}>
            Manage Opportunities
          </Heading>
          <Text color={textMuted} mb={4}>
            View your current volunteer events and create new ones to post to
            the community.
          </Text>
          <Button
            colorScheme="teal"
            onClick={() => navigate("/org/opportunities/new")}
          >
            Create New Opportunity
          </Button>
        </Box>

        {/* Current events */}
        <Box>
          <Heading size="lg" mb={4} color={textPrimary}>
            Current Events
          </Heading>
          {orgEvents.length === 0 ? (
            <Text color={textMuted}>
              You don&apos;t have any posted events yet. Create your first
              opportunity above.
            </Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              {orgEvents.map((evt) => (
                <Box
                  key={evt.id}
                  p={4}
                  bg={panelBg}
                  rounded="xl"
                  shadow="sm"
                  border={`1px solid ${borderColor}`}
                >
                  <Heading size="sm" mb={1} color={textPrimary}>
                    {evt.title}
                  </Heading>
                  <Text fontSize="sm" color={textMuted}>
                    {evt.location}
                  </Text>
                  <Text fontSize="sm" color={textMuted}>
                    {evt.date
                      ? new Date(evt.date).toLocaleDateString()
                      : "Date TBD"}
                  </Text>
                  <Badge
                    mt={2}
                    colorScheme={
                      (evt.status || "Open") === "Open" ? "green" : "yellow"
                    }
                  >
                    {evt.status || "Open"}
                  </Badge>

                  <Box mt={3}>
                    <Button
                      size="sm"
                      mr={2}
                      variant="outline"
                      onClick={() => handleEdit(evt)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDelete(evt.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Stack>
    </Container>
  );
}

