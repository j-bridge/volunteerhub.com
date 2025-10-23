import { Box, Container, Heading, Text, Stack, Button } from "@chakra-ui/react";

export default function Hero() {
  return (
    <Box as="section" py={{ base: 12, md: 20 }} bg="gray.50" _dark={{ bg: "gray.900" }}>
      <Container maxW="container.lg">
        <Stack align="center" textAlign="center" gap={4}>
          <Heading size={{ base: "lg", md: "xl" }}>
            Connect with causes. Make an impact.
          </Heading>
          <Text color="gray.600" _dark={{ color: "gray.300" }} maxW="60ch">
            Discover local volunteer opportunities and track your service hours in one place.
          </Text>
          <Stack direction={{ base: "column", sm: "row" }} gap={3}>
            <Button>Browse Opportunities</Button>
            <Button variant="outline">Partner With Us</Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
