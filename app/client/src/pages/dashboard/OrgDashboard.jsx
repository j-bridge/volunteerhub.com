import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Button,
  Badge,
  useColorModeValue,
  } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState, useMemo } from "react";
import { api } from "../../api/client";
import useAppToast from "../../hooks/useAppToast";

export default function OrgDashboard() {
  const navigate = useNavigate();
  const toast = useAppToast();
  const { user, deleteCreatedOpportunity } = useAuth();
  const cardBg = useColorModeValue("white", "var(--vh-ink-soft)");
  const panelBg = useColorModeValue("white", "#0b1f24");
  const textPrimary = useColorModeValue("#1f262a", "var(--vh-ink-text)");
  const textMuted = useColorModeValue("#4a5561", "rgba(231,247,244,0.72)");
  const borderColor = useColorModeValue("rgba(26,165,154,0.25)", "rgba(26,165,154,0.4)");

  const [orgEvents, setOrgEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOrgEvents = async () => {
    if (!user?.organization_id) return;
    setLoading(true);
    try {
      const res = await api.get("/opportunities", {
        params: { org_id: user.organization_id },
      });
      const mapped =
        res.data?.opportunities?.map((opp) => ({
          id: opp.id,
          title: opp.title,
          location: opp.location,
          date: opp.start_date || opp.created_at,
          status: opp.is_active ? "Open" : "Draft",
        })) || [];
      setOrgEvents(mapped);
    } catch (err) {
      toast({
        title: "Could not load your opportunities",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrgEvents();
  }, [user?.organization_id]);

  const mergedEvents = useMemo(() => {
    // Merge locally cached created opportunities for instant feedback
    const byId = new Map();
    (orgEvents || []).forEach((e) => byId.set(String(e.id), e));
    (user?.createdOpportunities || []).forEach((e) => {
      if (!byId.has(String(e.id))) byId.set(String(e.id), e);
    });
    return Array.from(byId.values());
  }, [orgEvents, user?.createdOpportunities]);

  const handleEdit = (evt) => {
    // Go to a dedicated edit page with the same form UI as "Create"
    navigate(`/org/opportunities/${evt.id}/edit`);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm(
      "Delete this opportunity? This cannot be undone."
    );
    if (!ok) return;

    try {
      await api.delete(`/opportunities/${id}`);
      deleteCreatedOpportunity(id);
      setOrgEvents((cur) => cur.filter((o) => String(o.id) !== String(id)));

      toast({
        title: "Opportunity deleted",
        status: "info",
        duration: 2500,
        isClosable: true,
      });
    } catch (err) {
      const msg = err?.response?.data?.error || "Could not delete opportunity";
      toast({
        title: msg,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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
          <Stack direction={{ base: "column", sm: "row" }} spacing={3}>
            <Button
              colorScheme="teal"
              onClick={() => navigate("/org/opportunities/new")}
            >
              Create New Opportunity
            </Button>
            <Button variant="outline" onClick={() => navigate("/org/certificates")}>
              Issue Certificates
            </Button>
          </Stack>
        </Box>

        {/* Current events */}
        <Box>
          <Heading size="lg" mb={4} color={textPrimary}>
            Current Events
          </Heading>
          {mergedEvents.length === 0 ? (
            <Text color={textMuted}>
              You don&apos;t have any posted events yet. Create your first
              opportunity above.
            </Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              {mergedEvents.map((evt) => (
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
