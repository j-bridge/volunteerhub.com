import {
  Box,
  Flex,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  SimpleGrid,
  HStack,
  VStack,
  Badge,
  Divider,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { opportunities as mockOpportunities } from "../mock/opportunities.jsx";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const cardBg = useColorModeValue("white", "var(--vh-ink-soft)");
  const textPrimary = useColorModeValue("gray.700", "var(--vh-ink-text)");
  const textSecondary = useColorModeValue("gray.600", "rgba(231,247,244,0.7)");
  const borderColor = useColorModeValue("rgba(52,152,219,0.12)", "rgba(15,108,95,0.3)");
  const highlightBg = useColorModeValue("rgba(52,152,219,0.06)", "rgba(15,108,95,0.12)");
  const highlightBorder = useColorModeValue("rgba(52,152,219,0.15)", "rgba(15,108,95,0.35)");
  const accent = useColorModeValue("#1aa59a", "#0f6c5f");

  const handleJourneySelect = (role) => {
    navigate("/signup", { state: { accountType: role } });
  };

  const goDashboard = () => {
    if (user?.role === "organization") {
      navigate("/org/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const featuredOpps = mockOpportunities.slice(0, 3);

  return (
    <Box w="100%" className="vh-page-bg">
      <Box
        bg="linear-gradient(135deg, rgba(52,152,219,0.14), rgba(139,195,74,0.12))"
        py={{ base: 12, md: 20 }}
      >
        <Container maxW="6xl">
          <Flex direction={{ base: "column", lg: "row" }} align="center" gap={10}>
            <VStack align="flex-start" spacing={4} flex="1">
              <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
                Trust • Growth • Impact
              </Badge>
              <Heading as="h1" size="2xl" color="var(--vh-heading)">
                Connect with causes. Grow your impact.
              </Heading>
              <Text fontSize="lg" color={textPrimary} maxW="720px">
                VolunteerHub makes it effortless to discover vetted opportunities, partner with nonprofits, and track
                the difference you make.
              </Text>
              <HStack spacing={3}>
                <Button colorScheme="blue" size="lg" onClick={() => navigate("/opportunities")}>
                  Find Opportunities
                </Button>
                {!user ? (
                  <Button variant="outline" size="lg" onClick={() => navigate("/signup")}>
                    Join VolunteerHub
                  </Button>
                ) : (
                  <Button variant="outline" size="lg" onClick={goDashboard}>
                    Go to My Dashboard
                  </Button>
                )}
              </HStack>
              <HStack spacing={6} pt={4} flexWrap="wrap">
                <StatPill label="Opportunities live" value="140+" />
                <StatPill label="Verified partners" value="60+" />
                <StatPill label="Hours logged" value="12,500+" />
              </HStack>
            </VStack>
            <Box flex="1" w="100%" position="relative">
              <Box
                bg={cardBg}
                borderRadius="xl"
                boxShadow="0 16px 40px rgba(0,0,0,0.08)"
                p={6}
                border={`1px solid ${borderColor}`}
                mb={4}
              >
                <Heading size="md" mb={3} color="var(--vh-heading)">
                  Why volunteers choose us
                </Heading>
                <Stack spacing={3}>
                  <HighlightItem title="Curated, trusted listings" desc="Every opportunity is reviewed for quality and safety." />
                  <HighlightItem title="Real-time availability" desc="See what’s open today, this week, or this month." />
                  <HighlightItem title="Instant confirmation" desc="Apply in one click and get notified when you’re accepted." />
                </Stack>
              </Box>
              <Image
                src="/images/vhub_hero.png"
                alt="VolunteerHub hero"
                w="100%"
                borderRadius="xl"
                boxShadow="0 16px 40px rgba(0,0,0,0.08)"
                border="1px solid rgba(52,152,219,0.12)"
                objectFit="cover"
              />
            </Box>
          </Flex>
        </Container>
      </Box>

      <Container maxW="6xl" py={{ base: 10, md: 14 }}>
        <Box
          bg={cardBg}
          p={6}
          borderRadius="xl"
          boxShadow="md"
          border={`1px solid ${borderColor}`}
        >
          <Heading size="md" mb={4} color="var(--vh-heading)">
            How it works
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <StepCard title="Explore" desc="Filter by cause, skills, location, and availability." />
            <StepCard title="Apply fast" desc="One-click applies with clear confirmation states." />
            <StepCard title="Make impact" desc="Track your hours and stay connected with your orgs." />
          </SimpleGrid>
          <Box
            mt={4}
            p={4}
            borderRadius="lg"
            bg={highlightBg}
            border={`1px solid ${highlightBorder}`}
          >
            <Heading size="sm" mb={2} color="var(--vh-heading)">
              Pick your journey
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
              <HStack
                spacing={3}
                p={4}
                borderRadius="md"
                bg={cardBg}
                border={`1px solid ${borderColor}`}
                boxShadow="sm"
                _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
                transition="all 150ms ease"
                cursor="pointer"
                onClick={() => handleJourneySelect("volunteer")}
              >
                <Badge colorScheme="blue">Volunteer</Badge>
                <Text fontSize="sm" color={textPrimary}>
                  Discover matches, apply in one click, and save favorites.
                </Text>
              </HStack>
              <HStack
                spacing={3}
                p={4}
                borderRadius="md"
                bg={cardBg}
                border={`1px solid ${borderColor}`}
                boxShadow="sm"
                _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
                transition="all 150ms ease"
                cursor="pointer"
                onClick={() => handleJourneySelect("organization")}
              >
                <Badge colorScheme="green">Organization</Badge>
                <Text fontSize="sm" color={textPrimary}>
                  Post roles, review applicants, and message volunteers.
                </Text>
              </HStack>
            </SimpleGrid>
          </Box>
        </Box>
      </Container>

      <Container maxW="6xl" py={{ base: 12, md: 16 }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={10}>
          <Box bg={cardBg} p={6} borderRadius="xl" boxShadow="md" border={`1px solid ${borderColor}`}>
            <Heading size="md" mb={3} color="var(--vh-heading)">
              About VolunteerHub
            </Heading>
            <Text color={textPrimary} mb={3}>
              VolunteerHub connects students and community members with organizations that need volunteers. Our mission
              is to make community impact simple, accessible, and meaningful.
            </Text>
            <Text color={textPrimary}>
              We bring every opportunity into one clean, centralized platform so organizations can share events, and
              volunteers can sign up with ease.
            </Text>
            <Button mt={4} colorScheme="teal" variant="outline" onClick={() => navigate("/about")}>
              Continue reading
            </Button>
          </Box>
          <Box
            bg={cardBg}
            p={6}
            borderRadius="xl"
            boxShadow="md"
            border={`1px solid ${borderColor}`}
          >
            <Heading size="md" mb={3} color="var(--vh-heading)">
              Preview Opportunities
            </Heading>
            <Box mt={4} p={4} bg={highlightBg} borderRadius="lg" border={`1px solid ${highlightBorder}`}>
              <Heading size="sm" mb={3} color="var(--vh-heading)">
                Opportunities Preview
              </Heading>
              <Stack spacing={3}>
                {featuredOpps.map((opp) => (
                  <Box key={opp.id} p={3} borderRadius="md" bg={cardBg} border={`1px solid ${borderColor}`}>
                    <HStack justify="space-between">
                      <Text fontWeight="700">{opp.title}</Text>
                      <Badge colorScheme="blue">{new Date(opp.date).toLocaleDateString()}</Badge>
                    </HStack>
                    <Text fontSize="sm" color={textSecondary}>
                      {opp.organization} • {opp.location}
                    </Text>
                    <Text fontSize="sm" color={textPrimary} noOfLines={2}>
                      {opp.description}
                    </Text>
                    <Button
                      size="sm"
                      mt={2}
                      alignSelf="flex-start"
                      variant="outline"
                      color={accent}
                      borderColor={accent}
                      onClick={() => navigate(`/opportunities/${opp.id}`)}
                    >
                      View
                    </Button>
                  </Box>
                ))}
              </Stack>
              <Button mt={4} colorScheme="blue" w="100%" onClick={() => navigate("/opportunities")}>
                View all opportunities
              </Button>
            </Box>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

function StatPill({ label, value }) {
  const statBg = useColorModeValue("white", "#0b1f24");
  const statBorder = useColorModeValue("rgba(52,152,219,0.15)", "rgba(15,108,95,0.4)");
  const textSecondary = useColorModeValue("gray.600", "rgba(231,247,244,0.7)");

  return (
    <Box
      px={4}
      py={3}
      borderRadius="lg"
      bg={statBg}
      border={`1px solid ${statBorder}`}
      boxShadow="sm"
    >
      <Text fontWeight="700" color="var(--vh-heading)">
        {value}
      </Text>
      <Text fontSize="sm" color={textSecondary}>
        {label}
      </Text>
    </Box>
  );
}

function HighlightItem({ title, desc }) {
  const textSecondary = useColorModeValue("gray.600", "rgba(231,247,244,0.7)");

  return (
    <Box>
      <Text fontWeight="700" color="var(--vh-heading)">
        {title}
      </Text>
      <Text fontSize="sm" color={textSecondary}>
        {desc}
      </Text>
    </Box>
  );
}

function StepCard({ title, desc }) {
  const highlightBg = useColorModeValue("rgba(52,152,219,0.06)", "rgba(15,108,95,0.12)");
  const highlightBorder = useColorModeValue("rgba(52,152,219,0.12)", "rgba(15,108,95,0.3)");
  const textPrimary = useColorModeValue("gray.700", "var(--vh-ink-text)");

  return (
    <Box bg={highlightBg} p={5} borderRadius="lg" border={`1px solid ${highlightBorder}`}>
      <Heading size="sm" mb={2} color="var(--vh-heading)">
        {title}
      </Heading>
      <Text fontSize="sm" color={textPrimary}>
        {desc}
      </Text>
    </Box>
  );
}
