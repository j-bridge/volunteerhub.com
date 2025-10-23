import { Box, Container, HStack, Text, Link } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box as="footer" borderTopWidth="1px" py={6} mt={12} bg="chakra-body-bg">
      <Container maxW="container.lg">
        <HStack justify="space-between" wrap="wrap" gap={3}>
          <Text>&copy; {new Date().getFullYear()} VolunteerHub</Text>
          <HStack gap={4}>
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Contact</Link>
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
}
