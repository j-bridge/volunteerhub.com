import { Box, Flex, HStack, Text, Link, Image, Stack, useColorModeValue } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const textColor = useColorModeValue("#4a5561", "#cdd5e0");
  const accent = useColorModeValue("#1aa59a", "#0f6c5f");
  const activeColor = accent;
  const isActive = (path) => location.pathname === path;

  const links = [
    { label: "Terms", to: "/legal#terms" },
    { label: "Privacy", to: "/legal#privacy" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <Box as="footer" w="100%" borderTopWidth="1px" py={6} mt={8} bg="chakra-body-bg">
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
        <Text fontSize="sm" color={textColor}>© {new Date().getFullYear()} VolunteerHub</Text>
        <Stack direction={{ base: "column", md: "row" }} spacing={4} align="center" justify="center" w="100%">
          <HStack spacing={6}>
            {links.map((item) => (
              <Link
                key={item.label}
                as={RouterLink}
                to={item.to}
                fontSize="sm"
                color={isActive(item.to.split("#")[0]) ? activeColor : textColor}
                fontWeight={isActive(item.to.split("#")[0]) ? "700" : "500"}
                _hover={{ color: activeColor, textDecoration: "none" }}
              >
                {item.label}
              </Link>
            ))}
          </HStack>
        </Stack>
      </Flex>
      <Flex w="100%" justify="center" mt={4}>
        <HStack spacing={2} align="center">
          <Text fontSize="sm" color={textColor}>Powered by</Text>
          <Link
            href="https://jbridgewater.com"
            target="_blank"
            rel="noopener noreferrer"
            display="inline-flex"
            alignItems="center"
          >
            <Image src="https://jbridgewater.com/assets/BRIDGEWATER_LOGO-BrToMz0-.png" alt="JBRIDGEWATER" height="1.2em" />
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
}
