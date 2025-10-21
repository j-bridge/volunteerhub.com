import { Box, Flex, HStack, Button, IconButton, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export default function NavBar() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box as="header" px={6} py={4} borderBottomWidth="1px">
      <Flex justify="space-between" align="center">
        <Box fontWeight="bold" fontSize="xl">
          VolunteerHub
        </Box>
        <HStack spacing={6}>
          <Button variant="ghost">Home</Button>
          <Button variant="ghost">Volunteer</Button>
          <Button variant="ghost">Contact</Button>
          <IconButton
            onClick={toggleColorMode}
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            aria-label="Toggle color mode"
          />
        </HStack>
      </Flex>
    </Box>
  );
}
