import { Container, Heading, Text } from "@chakra-ui/react";

export default function Volunteer() {
  return (
    <Container maxW="container.lg" py={12}>
      <Heading mb={3}>Volunteer Opportunities</Heading>
      <Text color="gray.600" _dark={{ color: "gray.300" }}>
        Placeholder page — we’ll list opportunities here later.
      </Text>
    </Container>
  );
}
