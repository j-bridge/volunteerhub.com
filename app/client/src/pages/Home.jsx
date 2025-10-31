import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    // Full-width background band
    <Box w="100%" bg="gray.50">
      {/* Center the inner content and cap its max width */}
      <Flex
        maxW="container.xl"   // content width cap
        mx="auto"             // center horizontally
        minH={{ base: "calc(100vh - 140px)", md: "calc(100vh - 160px)" }} // fill space between navbar & footer
        align="center"
        justify="center"
        direction="column"
        textAlign="center"
        px={6}
        py={16}
      >
        <Heading as="h1" size="2xl" mb={4}>
          Welcome to VolunteerHub
        </Heading>
        <Text fontSize="lg" color="gray.600" maxW="720px">
          Empowering communities through meaningful volunteering.
        </Text>
      </Flex>
    </Box>
  );
}
