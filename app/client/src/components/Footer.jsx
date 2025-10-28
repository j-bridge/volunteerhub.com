import { Box, Flex, HStack, Text, Link } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box as="footer" w="100%" borderTopWidth="1px" py={6} mt={12} bg="chakra-body-bg">
      <Flex
        w="100%"
        maxW="100%"      // no width cap
        px={6}           // padding from page edges
        align="center"
        justify="space-between"
        wrap="wrap"
        gap={3}
        mx="auto"
      >
        <Text fontSize="sm" color="gray.600">© {new Date().getFullYear()} VolunteerHub</Text>
        <HStack spacing={6}>
          <Link href="#" fontSize="sm" color="gray.600">Privacy</Link>
          <Link href="#" fontSize="sm" color="gray.600">Terms</Link>
          <Link href="#" fontSize="sm" color="gray.600">Contact</Link>
        </HStack>
      </Flex>
    </Box>
  );
}

