import {
  Box,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
  Divider,
  useColorModeValue,
  Link,
  Badge,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

const Section = ({ id, title, children }) => (
  <Box id={id} scrollMarginTop="100px">
    <Heading size="lg" mb={3}>
      {title}
    </Heading>
    <Stack spacing={3}>{children}</Stack>
  </Box>
);

export default function Legal() {
  const inkText = useColorModeValue("#1f262a", "var(--vh-ink-text)");
  const inkMuted = useColorModeValue("#4a5561", "var(--vh-ink-muted)");
  const surfaceBg = useColorModeValue("#ffffff", "var(--vh-ink-soft)");
  const surfaceAlt = useColorModeValue("#f8f6f2", "#0d1c22");
  const borderSoft = useColorModeValue("rgba(26,165,154,0.26)", "rgba(15,108,95,0.45)");
  const accent = useColorModeValue("#1aa59a", "#0f7c5f");

  return (
    <Box bg={useColorModeValue("#f2f0eb", "#08141a")} minH="100vh" py={{ base: 10, md: 16 }} px={{ base: 4, md: 10 }}>
      <Box maxW="5xl" mx="auto" color={inkText}>
        <Stack spacing={4} mb={8}>
          <Heading size="2xl">Terms &amp; Privacy</Heading>
          <Text fontSize="lg" color={inkMuted}>
            The highlights are below. We keep your data limited to what’s needed to run VolunteerHub.
            For anything not covered here, reach us at{" "}
            <Link href="mailto:support@volunteerhub.com" color={accent}>
              support@volunteerhub.com
            </Link>.
          </Text>
          <Stack direction={{ base: "column", md: "row" }} spacing={3} align="flex-start">
            <Badge colorScheme="teal" px={3} py={1} borderRadius="full">
              Updated: {new Date().getFullYear()}
            </Badge>
            <Stack direction="row" spacing={3} wrap="wrap">
              <Link href="#terms" color={accent} fontWeight="700">
                Jump to Terms
              </Link>
              <Link href="#privacy" color={accent} fontWeight="700">
                Jump to Privacy
              </Link>
            </Stack>
          </Stack>
        </Stack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={10}>
          <Box bg={surfaceBg} border={`1px solid ${borderSoft}`} borderRadius="2xl" p={5} boxShadow="md">
            <Heading size="sm" mb={3}>
              Quick commitments
            </Heading>
            <List spacing={3} color={inkMuted}>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color={accent} />
                Your account data stays in the platform and is not sold.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color={accent} />
                You control your content; remove it anytime from your profile.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color={accent} />
                We use cookies only for essential sessions and analytics.
              </ListItem>
            </List>
          </Box>
          <Box bg={surfaceAlt} border={`1px solid ${borderSoft}`} borderRadius="2xl" p={5} boxShadow="md">
            <Heading size="sm" mb={3}>
              For organizations
            </Heading>
            <Text color={inkMuted}>
              Keep opportunity listings accurate, honor volunteer commitments, and avoid sharing sensitive information
              (like health data) in public descriptions. Delete or update postings that are no longer active.
            </Text>
          </Box>
        </SimpleGrid>

        <Stack spacing={10} bg={surfaceBg} borderRadius="2xl" p={{ base: 6, md: 8 }} border={`1px solid ${borderSoft}`} boxShadow="lg">
          <Section id="terms" title="Terms of Use">
            <Text color={inkMuted}>
              By using VolunteerHub, you agree to follow these guidelines so the community stays safe and helpful.
            </Text>
            <List spacing={3} color={inkMuted}>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color={accent} />
                <Text as="span" fontWeight="600">Account responsibility:</Text> keep your login secure and let us know if you suspect misuse.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color={accent} />
                <Text as="span" fontWeight="600">Appropriate use:</Text> don’t post spam, misleading opportunities, or content that breaks the law.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color={accent} />
                <Text as="span" fontWeight="600">Volunteer safety:</Text> follow the guidance of host organizations and respect their rules on-site or online.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color={accent} />
                <Text as="span" fontWeight="600">Content ownership:</Text> you keep rights to what you create; you give us permission to display it on VolunteerHub.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color={accent} />
                <Text as="span" fontWeight="600">Service changes:</Text> we may update features; we’ll communicate significant changes where possible.
              </ListItem>
            </List>
          </Section>

          <Divider />

          <Section id="privacy" title="Privacy Notice">
            <Text color={inkMuted}>
              We minimize the data we collect and use it only to run the platform and improve your experience.
            </Text>
            <List spacing={3} color={inkMuted}>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color={accent} />
                <Text as="span" fontWeight="600">Data we collect:</Text> account info (name, email), opportunity details, activity logs, and basic device data.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color={accent} />
                <Text as="span" fontWeight="600">How we use it:</Text> authentication, notifications you opt into, analytics to improve usability, and safety monitoring.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color={accent} />
                <Text as="span" fontWeight="600">Sharing:</Text> limited to service providers we use to run the site (hosting, email); we don’t sell your data.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color={accent} />
                <Text as="span" fontWeight="600">Cookies:</Text> used for login sessions and basic analytics; adjust or clear them in your browser settings.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color={accent} />
                <Text as="span" fontWeight="600">Your choices:</Text> update or delete your profile, unsubscribe from emails, or request data removal at any time.
              </ListItem>
            </List>
            <Text color={inkMuted}>
              Need something removed or corrected? Email{" "}
              <Link href="mailto:support@volunteerhub.com" color={accent}>
                support@volunteerhub.com
              </Link>{" "}
              with your request.
            </Text>
          </Section>
        </Stack>
      </Box>
    </Box>
  );
}
