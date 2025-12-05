import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  HStack,
  Tag,
  Badge,
  Button,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Divider,
  SimpleGrid,
  VStack,
  Image,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { opportunities } from "../../mock/opportunities";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import useAppToast from "../../hooks/useAppToast";

export default function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, applyToOpportunity, saveOpportunity, removeSavedOpportunity } =
    useAuth();
  const toast = useAppToast();
  const [opportunity, setOpportunity] = useState(null);
  const [related, setRelated] = useState([]);
  const [applying, setApplying] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const pageBg = useColorModeValue("#f2f0eb", "#08141a");
  const cardBg = useColorModeValue("white", "var(--vh-ink-soft)");
  const textPrimary = useColorModeValue("#1f262a", "var(--vh-ink-text)");
  const textMuted = useColorModeValue("#4a5561", "rgba(231,247,244,0.78)");
  const isNumericId = /^\d+$/.test(String(id || ""));

  const normalizeApiOpp = (opp) => ({
    id: opp.id,
    title: opp.title,
    organization: opp.organization?.name || (opp.org_id ? `Organization #${opp.org_id}` : "Organization"),
    date: opp.start_date || opp.created_at || new Date().toISOString(),
    location: opp.location || "TBD",
    category: opp.category || "Community",
    description: opp.description || "",
    tags: [],
    mode: opp.mode || "In-person",
    timeCommitment: opp.timeCommitment,
    spotsRemaining: opp.spotsRemaining,
  });

  useEffect(() => {
    const load = async () => {
      // Skip API calls for non-numeric IDs (unsynced/local) to avoid server errors
      if (!isNumericId) {
        const localMatch =
          user?.createdOpportunities?.find((o) => String(o.id) === String(id)) ||
          user?.savedOpportunities?.find((o) => String(o.id) === String(id)) ||
          user?.appliedOpportunities?.find((o) => String(o.id) === String(id));

        if (localMatch) {
          setOpportunity({
            ...localMatch,
            organization:
              typeof localMatch.organization === "string"
                ? localMatch.organization
                : localMatch.organization?.name || "Organization",
          });
        } else {
          setLoadError("This opportunity has not finished syncing yet. Please refresh after it’s created.");
          setOpportunity(null);
        }
        setRelated([]);
        return;
      }

      try {
        const res = await api.get(`/opportunities/${id}`);
        if (res.data?.opportunity) {
          const normalized = normalizeApiOpp(res.data.opportunity);
          setOpportunity(normalized);
          setRelated(
            opportunities
              .filter(
                (o) =>
                  String(o.id) !== String(normalized.id) &&
                  (o.location === normalized.location ||
                    o.category === normalized.category ||
                    (o.tags || []).some((t) => (normalized.tags || []).includes(t)))
              )
              .slice(0, 3)
          );
          return;
        }
      } catch (err) {
        // fall back to mock
      }
      const mock = opportunities.find((o) => String(o.id) === String(id));
      setOpportunity(mock || null);
      setRelated(
        opportunities
          .filter(
            (o) =>
              String(o.id) !== String(id) &&
              (o.location === mock?.location ||
                o.category === mock?.category ||
                (o.tags || []).some((t) => (mock?.tags || []).includes(t)))
          )
          .slice(0, 3)
      );
    };
    load();
  }, [id, isNumericId, user]);

  if (!opportunity) {
    return (
      <Box bg={pageBg} minH="100vh" py={{ base: 10, md: 16 }}>
        <Container maxW="4xl">
          <Heading size="lg" mb={4} color={textPrimary}>
            Opportunity not found
          </Heading>
          <Text mb={6} color={textMuted}>
            {loadError ||
              "We couldn’t find the opportunity you’re looking for. It may have been removed or the link is invalid."}
          </Text>
          <Button onClick={() => navigate("/opportunities")} colorScheme="teal">
            Back to opportunities
          </Button>
        </Container>
      </Box>
    );
  }

  const isApplied = !!user?.appliedOpportunities?.some(
    (o) => String(o.id) === String(opportunity.id)
  );
  const isSaved = !!user?.savedOpportunities?.some(
    (o) => String(o.id) === String(opportunity.id)
  );

  const handleApplyRequest = () => {
    if (!user) {
      navigate("/login", { state: { fromApply: true } });
      return;
    }

    if (user.role !== "volunteer") {
      toast({
        title: "Volunteer account required",
        description:
          "Only volunteer accounts can apply for opportunities. Please sign in with a volunteer account or create one.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (isApplied) {
      toast({
        title: "Already applied",
        description: "You have already applied for this opportunity.",
        status: "info",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    setConfirmOpen(true);
  };

  const handleApplyConfirm = async () => {
    setConfirmOpen(false);

    const summary = {
      id: opportunity.id,
      title: opportunity.title,
      organization: opportunity.organization,
      date: opportunity.date,
      location: opportunity.location,
      category: opportunity.category,
    };

    setApplying(true);
    try {
      await api.post("/applications/", { opportunity_id: opportunity.id });
      applyToOpportunity(summary);
      toast({
        title: "Application submitted",
        description: "This opportunity now appears in your dashboard.",
        status: "success",
      });
    } catch (err) {
      const msg = err?.response?.data?.error || "Could not submit application";
      toast({
        title: "Error",
        description: msg,
        status: "error",
      });
    } finally {
      setApplying(false);
    }
  };

  const handleToggleSave = () => {
    if (!user) {
      navigate("/login", { state: { fromSave: true } });
      return;
    }

    if (user.role !== "volunteer") {
      toast({
        title: "Volunteer account required",
        description:
          "Only volunteer accounts can save opportunities for later.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const summary = {
      id: opportunity.id,
      title: opportunity.title,
      organization: opportunity.organization,
      date: opportunity.date,
      location: opportunity.location,
      category: opportunity.category,
    };

    if (isSaved) {
      removeSavedOpportunity(opportunity.id);
      toast({
        title: "Removed from saved",
        status: "info",
        duration: 2500,
        isClosable: true,
      });
    } else {
      saveOpportunity(summary);
      toast({
        title: "Saved for later",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg={pageBg} minH="100vh" py={{ base: 10, md: 16 }}>
      <Container maxW="6xl">
        <Button mb={6} variant="ghost" onClick={() => navigate("/opportunities")}>
          ← Back to opportunities
        </Button>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Box
            gridColumn={{ base: "1 / -1", md: "1 / span 2" }}
            bg={cardBg}
            borderRadius="2xl"
            p={{ base: 6, md: 8 }}
            boxShadow="lg"
            borderWidth="1px"
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <Stack spacing={4}>
              <Image
                src="/images/vhub.jpg"
                alt={opportunity.title}
                borderRadius="xl"
                objectFit="cover"
                maxH="260px"
                w="100%"
              />
              <HStack justify="space-between" align="flex-start">
                <Box>
                  <Heading size="xl" mb={2} color={textPrimary}>
                    {opportunity.title}
                  </Heading>
                  <Text fontSize="md" color={textMuted}>
                    {opportunity.organization}
                  </Text>
                </Box>
                {opportunity.category && (
                  <Tag size="md" variant="subtle" colorScheme="blue">
                    {opportunity.category}
                  </Tag>
                )}
              </HStack>

              <HStack spacing={3} fontSize="sm" color={textMuted} flexWrap="wrap">
                <Badge variant="subtle">{opportunity.location}</Badge>
                <Badge colorScheme="green">{opportunity.mode || "In-person"}</Badge>
                <Badge colorScheme="purple">{opportunity.timeCommitment || "Flexible"}</Badge>
                {typeof opportunity.spotsRemaining === "number" && (
                  <Badge colorScheme={opportunity.spotsRemaining > 5 ? "blue" : "red"}>
                    Spots left: {opportunity.spotsRemaining}
                  </Badge>
                )}
                <Text>
                  {new Date(opportunity.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </HStack>

              <Text fontSize="md" color={textPrimary}>
                {opportunity.description}
              </Text>

              {opportunity.skills && (
                <Box>
                  <Heading size="sm" mb={2}>
                    Skills
                  </Heading>
                  <HStack spacing={2} flexWrap="wrap">
                    {opportunity.skills.map((s) => (
                      <Badge key={s} colorScheme="blue">
                        {s}
                      </Badge>
                    ))}
                  </HStack>
                </Box>
              )}

              <HStack spacing={3} pt={2} flexWrap="wrap">
                <Button colorScheme="teal" onClick={handleApplyRequest} isDisabled={isApplied || applying} isLoading={applying}>
                  {isApplied ? "Applied" : "Apply"}
                </Button>
                <Button variant="outline" onClick={handleToggleSave}>
                  {isSaved ? "Unsave" : "Save for later"}
                </Button>
              </HStack>
            </Stack>
          </Box>

          <VStack
            spacing={4}
            align="stretch"
            bg={cardBg}
            borderRadius="2xl"
            p={{ base: 6, md: 8 }}
            boxShadow="lg"
            borderWidth="1px"
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <Heading size="md">Quick info</Heading>
            <Text fontSize="sm" color={textMuted}>
              Contact: {opportunity.contactEmail} {opportunity.contactPhone ? `• ${opportunity.contactPhone}` : ""}
            </Text>
            {opportunity.tags && (
              <Stack spacing={2}>
                <Heading size="sm">Tags</Heading>
                <HStack spacing={2} flexWrap="wrap">
                  {opportunity.tags.map((t) => (
                    <Badge key={t} colorScheme="gray">
                      {t}
                    </Badge>
                  ))}
                </HStack>
              </Stack>
            )}
            <Divider />
            <Stack spacing={3}>
              <Heading size="sm">What to expect</Heading>
              <Text fontSize="sm" color={textPrimary}>
                Clear onboarding, day-of instructions, and a point of contact will be provided once you apply.
              </Text>
            </Stack>
            <Stack spacing={3}>
              <Heading size="sm">Location</Heading>
              <Text fontSize="sm" color={textPrimary}>
                {opportunity.location}
              </Text>
            </Stack>
          </VStack>
        </SimpleGrid>

        {related && related.length > 0 && (
          <Box mt={10}>
            <Heading size="md" mb={4}>Related Opportunities</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {related.map((opp) => (
                <Box
                  key={opp.id}
                  p={4}
                  bg={cardBg}
                  borderRadius="lg"
                  boxShadow="md"
                  borderWidth="1px"
                  borderColor={useColorModeValue("gray.200", "gray.700")}
                >
                  <Heading size="sm" mb={1} color={textPrimary}>{opp.title}</Heading>
                  <Text fontSize="sm" color={textMuted} mb={1}>{opp.organization}</Text>
                  <HStack spacing={2} mb={2} fontSize="sm" color={textMuted}>
                    <Badge>{opp.location}</Badge>
                    {opp.category && <Badge colorScheme="blue">{opp.category}</Badge>}
                  </HStack>
                  <Text fontSize="sm" color={textPrimary} noOfLines={3}>{opp.description}</Text>
                  <Button
                    mt={3}
                    size="sm"
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => navigate(`/opportunities/${opp.id}`)}
                  >
                    View
                  </Button>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        )}
      </Container>

      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Apply for this opportunity?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Confirm you want to apply for &quot;{opportunity?.title}&quot; at {opportunity?.organization}.
            </Text>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleApplyConfirm} isLoading={applying}>
              Yes, apply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
