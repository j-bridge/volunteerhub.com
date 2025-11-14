import {
  Container,
  Heading,
  Text,
  Stack,
  Box,
  Link,
} from "@chakra-ui/react";

export default function Contact() {
  return (
    <Container maxW="4xl" py={10}>
      <Stack spacing={6}>
        <Heading size="2xl">Contact</Heading>
        <Text color="gray.600">
          We'd love to hear from you. Reach out for partnerships, questions,
          or feedback.
        </Text>

        <Box p={6} rounded="2xl" shadow="sm" bg="white">
          <Stack spacing={2}>
            <Text>
              <strong>Email:</strong>{" "}
              <Link href="mailto:support@volunteerhub.test">
                support@volunteerhub.test
              </Link>
            </Text>
            <Text>
              <strong>Community:</strong>{" "}
              <Link href="#">Discord (coming soon)</Link>
            </Text>
            <Text>
              <strong>Docs:</strong>{" "}
              <Link href="#">Getting Started Guide</Link>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
