import { Container, Heading, Text } from "@chakra-ui/react";

export default function Contact() {
  return (
    <Container maxW="container.lg" py={12}>
      <Heading mb={3}>Contact</Heading>
      <Text color="gray.600" _dark={{ color: "gray.300" }}>
        Partner organizations can reach out here (form coming soon).
      </Text>
    </Container>
  );
}
