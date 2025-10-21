import { Box, Flex, HStack, Button, IconButton } from "@chakra-ui/react";
import { Moon } from "lucide-react";

export default function NavBar() {
  return (
    <Box as="header" px={6} py={4} borderBottomWidth="1px" boxShadow="sm">
      <Flex justify="space-between" align="center">
        <Box fontWeight="bold" fontSize="xl">VolunteerHub</Box>
        <HStack spacing={6}>
          <Button variant="ghost">Home</Button>
          <Button variant="ghost">Volunteer</Button>
          <Button variant="ghost">Contact</Button>
          <IconButton aria-label="Toggle color mode" icon={<Moon size={18} />} variant="ghost" />
        </HStack>
      </Flex>
    </Box>
  );
}
