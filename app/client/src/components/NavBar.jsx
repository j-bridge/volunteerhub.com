import { Box, Container, Flex, HStack, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function NavBar() {
  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={50}
      bg="chakra-body-bg"
      borderBottomWidth="1px"
    >
      <Container maxW="container.xl" px={6}>
        <Flex h={16} align="center" justify="space-between">
          {/* Logo / Brand */}
          <Button
            as={RouterLink}
            to="/"
            variant="link"
            fontWeight="bold"
            fontSize="xl"
            px={0}
          >
            VolunteerHub
          </Button>

          {/* Navigation Links */}
          <HStack spacing={6}>
            <Button as={RouterLink} to="/" variant="ghost" px={0}>
              Home
            </Button>
            <Button as={RouterLink} to="/volunteer" variant="ghost" px={0}>
              Volunteer
            </Button>
            <Button as={RouterLink} to="/contact" variant="ghost" px={0}>
              Contact
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}