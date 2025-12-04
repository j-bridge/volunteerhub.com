// app/client/src/pages/static/About.jsx

import {
  Box,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  HStack,
  Avatar,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";


const About = () => {
  const cardBg = useColorModeValue("white", "gray.800");
  const sectionBg = useColorModeValue("gray.50", "gray.900");

  return (
    <Box py={{ base: 10, md: 16 }} px={{ base: 4, md: 10 }} maxW="6xl" mx="auto">
      
      {/* Header */}
      <Stack spacing={6} mb={12}>
        <Heading size="2xl">About VolunteerHub</Heading>
        <Text fontSize="lg" color={useColorModeValue("gray.600", "rgba(231,247,244,0.7)")}>
          VolunteerHub connects students and community members with
          organizations that need volunteers. Our mission is to make community
          impact simple, accessible, and meaningful.
        </Text>
        <Image
          src="/images/vhub3.jpg"
          alt="Volunteering"
          borderRadius="xl"
          boxShadow="0 16px 40px rgba(0,0,0,0.08)"
          border="1px solid rgba(52,152,219,0.12)"
          objectFit="cover"
        />
      </Stack>

      {/* Mission / Who We Serve */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mb={16}>

        <Box>
          <Heading size="md" mb={4}>Our Mission</Heading>
          <Text color={useColorModeValue("gray.600", "rgba(231,247,244,0.7)")} mb={3}>
            VolunteerHub was created because finding volunteer opportunities was
            too scattered across flyers, group chats, and random websites.
          </Text>
          <Text color={useColorModeValue("gray.600", "rgba(231,247,244,0.7)")}>
            We solve this by bringing everything into one clean, centralized
            platform—so organizations can share events, and volunteers can sign
            up with ease.
          </Text>
        </Box>

        <Box bg={sectionBg} borderRadius="2xl" p={6}>
          <Heading size="sm" mb={4}>Who We Serve</Heading>
          <Stack spacing={4}>
            <HStack align="flex-start">
              <Box>
                <Text fontWeight="semibold">Volunteers</Text>
                <Text fontSize="sm" color={useColorModeValue("gray.600", "rgba(231,247,244,0.7)")}>
                  Students and community members looking to give back.
                </Text>
              </Box>
            </HStack>

            <HStack align="flex-start">
              <Box>
                <Text fontWeight="semibold">Nonprofits</Text>
                <Text fontSize="sm" color={useColorModeValue("gray.600", "rgba(231,247,244,0.7)")}>
                  Community partners needing help for events, drives, and programs.
                </Text>
              </Box>
            </HStack>

            <HStack align="flex-start">
              <Box>
                <Text fontWeight="semibold">Campus Organizations</Text>
                <Text fontSize="sm" color={useColorModeValue("gray.600", "rgba(231,247,244,0.7)")}>
                  Departments and clubs coordinating service initiatives.
                </Text>
              </Box>
            </HStack>
          </Stack>
        </Box>

      </SimpleGrid>

      {/* How it Works */}
      <Box mb={16}>
        <Heading size="md" mb={6}>How It Works</Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="sm">
            <Heading size="sm" mb={2}>1. Explore</Heading>
            <Text fontSize="sm" color={useColorModeValue("gray.600", "rgba(231,247,244,0.7)")}>
              Browse events by cause, date, skills, and location.
            </Text>
          </Box>

          <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="sm">
            <Heading size="sm" mb={2}>2. Sign Up</Heading>
            <Text fontSize="sm" color={useColorModeValue("gray.600", "rgba(231,247,244,0.7)")}>
              View details and register with one click.
            </Text>
          </Box>

          <Box bg={cardBg} p={6} borderRadius="2xl" boxShadow="sm">
            <Heading size="sm" mb={2}>3. Make an Impact</Heading>
            <Text fontSize="sm" color={useColorModeValue("gray.600", "rgba(231,247,244,0.7)")}>
              Track your volunteer participation and stay involved.
            </Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Team */}
      <Box
        bg={useColorModeValue("#f8f6f2", "var(--vh-ink-soft)")}
        color={useColorModeValue("#1f262a", "var(--vh-ink-text)")}
        p={{ base: 6, md: 8 }}
        borderRadius="2xl"
        boxShadow="0 24px 60px rgba(0,0,0,0.35)"
        border={`1px solid ${useColorModeValue("rgba(26,165,154,0.2)", "rgba(15,108,95,0.4)")}`}
      >
        <Heading size="md" mb={6} color={useColorModeValue("#1f262a", "var(--vh-ink-text)")}>
          Meet the Team
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <Stack align="center">
            <Avatar size="xl" name="Jeremiah" />
            <Text fontWeight="semibold">Jeremiah</Text>
            <Text fontSize="sm" fontWeight="600" color={useColorModeValue("#4a5561", "var(--vh-ink-muted)")}>
              PM &amp; Lead Developer
            </Text>
            <Text fontSize="sm" color={useColorModeValue("#1f262a", "var(--vh-ink-text)")} opacity={0.85} textAlign="center">
              Server config, utilities, script creation, optimization, and delivery.
            </Text>
          </Stack>

          <Stack align="center">
            <Avatar size="xl" name="Cameron" />
            <Text fontWeight="semibold">Cameron</Text>
            <Text fontSize="sm" fontWeight="600" color={useColorModeValue("#4a5561", "var(--vh-ink-muted)")}>
              Lead Front End Engineer
            </Text>
            <Text fontSize="sm" color={useColorModeValue("#1f262a", "var(--vh-ink-text)")} opacity={0.85} textAlign="center">
              UI components, Chakra theme, routing, copy integration.
            </Text>
          </Stack>

          <Stack align="center">
            <Avatar size="xl" name="Catalina" />
            <Text fontWeight="semibold">Catalina</Text>
            <Text fontSize="sm" fontWeight="600" color={useColorModeValue("#4a5561", "var(--vh-ink-muted)")}>
              QA Specialist
            </Text>
            <Text fontSize="sm" color={useColorModeValue("#1f262a", "var(--vh-ink-text)")} opacity={0.85} textAlign="center">
              Code reviews, style and compatibility checks.
            </Text>
          </Stack>

          <Stack align="center">
            <Avatar size="xl" name="Chandler" />
            <Text fontWeight="semibold">Chandler</Text>
            <Text fontSize="sm" fontWeight="600" color={useColorModeValue("#4a5561", "var(--vh-ink-muted)")}>
              Data Analyst
            </Text>
            <Text fontSize="sm" color={useColorModeValue("#1f262a", "var(--vh-ink-text)")} opacity={0.85} textAlign="center">
              SQLAlchemy models, Flask blueprints, data insights.
            </Text>
          </Stack>

          <Stack align="center">
            <Avatar size="xl" name="Nadina" />
            <Text fontWeight="semibold">Nadina</Text>
            <Text fontSize="sm" fontWeight="600" color={useColorModeValue("#4a5561", "var(--vh-ink-muted)")}>
              Jr Developer
            </Text>
            <Text fontSize="sm" color={useColorModeValue("#1f262a", "var(--vh-ink-text)")} opacity={0.85} textAlign="center">
              Backend & business logic, Flask setup, route handlers, schema integration.
            </Text>
          </Stack>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default About;
