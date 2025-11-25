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
  useToast,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { opportunities } from "../../mock/opportunities";
import { useAuth } from "../../context/AuthContext";

export default function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, applyToOpportunity, saveOpportunity, removeSavedOpportunity } =
    useAuth();
  const toast = useToast();

  const pageBg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  const opportunity = opportunities.find((o) => String(o.id) === String(id));

  if (!opportunity) {
    return (
      <Box bg={pageBg} minH="100vh" py={{ base: 10, md: 16 }}>
        <Container maxW="4xl">
          <Heading size="lg" mb={4}>
            Opportunity not found
          </Heading>
          <Text mb={6} color="gray.600">
            We couldn&apos;t find the opportunity you&apos;re looking for. It may
            have been removed or the link is invalid.
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

  const handleApply = () => {
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

    const confirmed = window.confirm(
      `Apply for "${opportunity.title}" at ${opportunity.organization}?`
    );
    if (!confirmed) return;

    const summary = {
      id: opportunity.id,
      title: opportunity.title,
      organization: opportunity.organization,
      date: opportunity.date,
      location: opportunity.location,
      category: opportunity.category,
    };

    applyToOpportunity(summary);

    toast({
      title: "Application recorded",
      description: "This opportunity now appears in your dashboard.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
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
      <Container maxW="4xl">
        <Button
          mb={6}
          variant="ghost"
          onClick={() => navigate("/opportunities")}
        >
          ← Back to opportunities
        </Button>

        <Box
          bg={cardBg}
          borderRadius="2xl"
          p={{ base: 6, md: 8 }}
          boxShadow="sm"
          borderWidth="1px"
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
          <Stack spacing={4}>
            <HStack justify="space-between" align="flex-start">
              <Box>
                <Heading size="xl" mb={2}>
                  {opportunity.title}
                </Heading>
                <Text fontSize="md" color="gray.600">
                  {opportunity.organization}
                </Text>
              </Box>
              {opportunity.category && (
                <Tag size="md" variant="subtle">
                  {opportunity.category}
                </Tag>
              )}
            </HStack>

            <HStack spacing={4} fontSize="sm" color="gray.600">
              <Badge variant="subtle">{opportunity.location}</Badge>
              <Text>
                {new Date(opportunity.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </HStack>

            <Text fontSize="md" color="gray.700">
              {opportunity.description}
            </Text>

            <HStack spacing={3} pt={4}>
              <Button colorScheme="teal" onClick={handleApply} isDisabled={isApplied}>
                {isApplied ? "Applied" : "Apply"}
              </Button>
              <Button variant="outline" onClick={handleToggleSave}>
                {isSaved ? "Unsave" : "Save for later"}
              </Button>
            </HStack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}



