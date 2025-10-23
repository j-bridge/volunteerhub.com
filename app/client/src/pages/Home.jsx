import { Box, Container, Heading, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box py={16}>
      <Container maxW="container.lg" textAlign="center">
        <Heading as="h1" size="2xl" mb={4}>
          Welcome to VolunteerHub
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Empowering communities through meaningful volunteering.
        </Text>
      </Container>
    </Box>
  );
}
