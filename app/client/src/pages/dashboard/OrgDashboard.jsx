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
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState, useMemo, useRef } from "react";
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
  const [orgApps, setOrgApps] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

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

  const loadOrgApplications = async () => {
    if (!user?.organization_id) return;
    setLoadingApps(true);
    try {
      const res = await api.get("/applications/org", { params: { org_id: user.organization_id } });
      setOrgApps(res.data?.applications || []);
    } catch (err) {
      toast({
        title: "Could not load applications",
        status: "error",
      });
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    loadOrgEvents();
    loadOrgApplications();
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

  const isNumericId = (val) => /^\d+$/.test(String(val || ""));

  const handleDelete = (id) => {
    setDeleteId(id);
    onOpen();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/opportunities/${deleteId}`);
      deleteCreatedOpportunity(deleteId);
      setOrgEvents((cur) => cur.filter((o) => String(o.id) !== String(deleteId)));

      toast({
        title: "Opportunity deleted",
        status: "info",
      });
    } catch (err) {
      const msg = err?.response?.data?.error || "Could not delete opportunity";
      toast({
        title: msg,
        status: "error",
      });
    } finally {
      setDeleteId(null);
      onClose();
    }
  };

  return (
    <Container maxW="6xl" py={10}>
      <Stack spacing={8}>
        <Stack direction={{ base: "column", sm: "row" }} justify="space-between" align={{ base: "flex-start", sm: "center" }}>
          <Heading size="2xl" color={textPrimary}>Organization Dashboard</Heading>
          <Button variant="outline" size="sm" onClick={() => navigate("/account")}>
            Account Settings
          </Button>
        </Stack>

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
                      isDisabled={!isNumericId(evt.id)}
                    >
                      {isNumericId(evt.id) ? "Edit" : "Unsynced"}
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDelete(evt.id)}
                      isDisabled={!isNumericId(evt.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>

        <Box p={6} bg={cardBg} rounded="2xl" shadow="md" border={`1px solid ${borderColor}`}>
          <Heading size="lg" mb={4} color={textPrimary}>
            Applications for your opportunities
          </Heading>
          {orgApps.length === 0 ? (
            <Text color={textMuted}>{loadingApps ? "Loading..." : "No applications yet."}</Text>
          ) : (
            <Stack spacing={3}>
              {orgApps.map((app) => (
                <Box key={app.id} p={4} bg={panelBg} rounded="md" border={`1px solid ${borderColor}`}>
                  <Text color={textPrimary} fontWeight="bold">
                    Application #{app.id} — Opportunity #{app.opportunity_id}
                  </Text>
                  <Text color={textMuted}>Volunteer ID: {app.user_id}</Text>
                  <Text color={textMuted}>Status: {app.status}</Text>
                </Box>
              ))}
            </Stack>
          )}
          <Button mt={4} size="sm" variant="outline" onClick={loadOrgApplications} isLoading={loadingApps}>
            Refresh applications
          </Button>
        </Box>
      </Stack>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          setDeleteId(null);
          onClose();
        }}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete opportunity?
            </AlertDialogHeader>

            <AlertDialogBody>
              This cannot be undone. Do you want to delete this opportunity?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef.current} onClick={() => { setDeleteId(null); onClose(); }}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
}
