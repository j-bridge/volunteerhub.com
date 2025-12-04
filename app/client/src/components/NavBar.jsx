import { Box, Flex, HStack, Link, Button, Spacer, Text, Image, Stack, IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const navBg = useColorModeValue(
    `rgba(255,255,255,${scrolled ? 0.95 : 0.75})`,
    `rgba(15,23,42,${scrolled ? 0.95 : 0.8})`
  );
  const navShadow = scrolled
    ? "0 16px 40px rgba(0,0,0,0.12)"
    : "0 8px 20px rgba(0,0,0,0.08)";
  const accent = useColorModeValue("#1aa59a", "#0f6c5f");
  const linkColor = useColorModeValue("#1f262a", "#e2e8f0");
  const activeColor = accent;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 8);

      const delta = currentY - lastScrollY.current;
      // Only auto-close mobile menu on meaningful downward scroll; ignore upward scroll to avoid snapping shut.
      if (mobileOpen && delta > 25) {
        setMobileOpen(false);
      }

      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mobileOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <Box
      as="nav"
      w="100%"
      bg={navBg}
      backdropFilter="blur(10px)"
      boxShadow={navShadow}
      px={{ base: 4, md: 8 }}
      py={4}
      position="sticky"
      top="0"
      zIndex="1000"
      transition="all 200ms ease"
    >
      <Flex align="center">
        {/* Logo acts as Home */}
        <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
          <Stack direction="row" align="center" spacing={2}>
            <Image
              src="/vhub_logo.png"
              alt="VolunteerHub"
              height="34px"
              transition="transform 150ms ease"
              _hover={{ transform: "scale(1.05)" }}
            />
            <Text fontSize="xl" fontWeight="bold" color="teal.500">
              VolunteerHub
            </Text>
          </Stack>
        </Link>

        <Spacer />

        {/* Primary nav links */}
        <HStack spacing={5} display={{ base: "none", md: "flex" }} align="center">
          {[
            { to: "/opportunities", label: "Opportunities", weight: "600" },
            { to: "/about", label: "About", weight: "600" },
            { to: "/contact", label: "Contact", weight: "600" },
            { to: "/videos", label: "Videos", weight: "500" },
          ].map((item) => (
            <Link
              key={item.to}
              as={RouterLink}
              to={item.to}
              fontWeight={item.weight}
              px={3}
              py={2}
              borderRadius="md"
              color={isActive(item.to) ? activeColor : linkColor}
              _hover={{
                boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                textDecoration: "none",
                transform: "translateY(-1px)",
                color: activeColor,
              }}
              _activeLink={{ color: activeColor }}
              transition="all 150ms ease"
            >
              {item.label}
            </Link>
          ))}
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            size="sm"
            variant="ghost"
            onClick={toggleColorMode}
          />

          {/* Only show My Dashboard when logged in */}
          {user && (
            <Link
              as={RouterLink}
              to={
                user.role === "organization"
                  ? "/org/dashboard"
                  : user.role === "admin"
                    ? "/admin/dashboard"
                    : "/dashboard"
              }
              fontWeight="500"
            >
              My Dashboard
            </Link>
          )}
          {user && (
            <Link as={RouterLink} to="/account" fontWeight="500">
              Account
            </Link>
          )}
          {user?.role === "organization" && (
            <Link as={RouterLink} to="/org/certificates" fontWeight="500">
              Certificates
            </Link>
          )}
          {user?.role === "admin" && (
            <>
              <Link as={RouterLink} to="/admin/dashboard" fontWeight="600" color="teal.600">
                Admin
              </Link>
              <Link as={RouterLink} to="/admin/certificates" fontWeight="500">
                Certs
              </Link>
            </>
          )}
        </HStack>

        <Spacer />

        {/* Auth-aware actions */}
        {user ? (
          <HStack spacing={4} display={{ base: "none", md: "flex" }}>
            <Text fontSize="sm" color="gray.600">
              Hello, {user?.name || user?.email || "Volunteer"}
            </Text>
            <Button
              onClick={handleLogout}
              colorScheme="teal"
              variant="outline"
              size="sm"
            >
              Log out
            </Button>
          </HStack>
        ) : (
          <HStack spacing={4} display={{ base: "none", md: "flex" }}>
            <Button
              as={RouterLink}
              to="/login"
              colorScheme="teal"
              variant="outline"
              size="sm"
            >
              Log In
            </Button>
            <Button as={RouterLink} to="/signup" colorScheme="teal" size="sm">
              Sign Up
            </Button>
          </HStack>
        )}

        {/* Mobile menu toggle */}
        <Box display={{ base: "block", md: "none" }}>
          <IconButton
            aria-label="Toggle menu"
            icon={mobileOpen ? <CloseIcon /> : <HamburgerIcon />}
            variant="ghost"
            onClick={() => setMobileOpen((v) => !v)}
          />
        </Box>
      </Flex>

      {/* Mobile menu content */}
      {mobileOpen && (
        <Box
          mt={3}
          display={{ base: "block", md: "none" }}
          bg={colorMode === "light" ? "whiteAlpha.95" : "gray.800"}
          borderRadius="lg"
          boxShadow="0 12px 30px rgba(0,0,0,0.18)"
          p={4}
        >
          <Stack spacing={3} align="flex-start">
            <Link
              as={RouterLink}
              to="/opportunities"
              color={isActive("/opportunities") ? activeColor : linkColor}
              fontWeight={isActive("/opportunities") ? "700" : "500"}
              onClick={() => setMobileOpen(false)}
            >
              Opportunities
            </Link>
            <Link
              as={RouterLink}
              to="/about"
              color={isActive("/about") ? activeColor : linkColor}
              fontWeight={isActive("/about") ? "700" : "500"}
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <Link
              as={RouterLink}
              to="/contact"
              color={isActive("/contact") ? activeColor : linkColor}
              fontWeight={isActive("/contact") ? "700" : "500"}
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>
            <Link
              as={RouterLink}
              to="/videos"
              color={isActive("/videos") ? activeColor : linkColor}
              fontWeight={isActive("/videos") ? "700" : "500"}
              onClick={() => setMobileOpen(false)}
            >
              Videos
            </Link>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toggleColorMode();
                setMobileOpen(false);
              }}
            >
              {colorMode === "light" ? "Dark mode" : "Light mode"}
            </Button>
            {user ? (
              <>
                <Link
                  as={RouterLink}
                  to={
                    user.role === "organization"
                      ? "/org/dashboard"
                      : user.role === "admin"
                        ? "/admin/dashboard"
                        : "/dashboard"
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  My Dashboard
                </Link>
                <Link as={RouterLink} to="/account" onClick={() => setMobileOpen(false)}>
                  Account
                </Link>
                {user.role === "organization" && (
                  <Link as={RouterLink} to="/org/certificates" onClick={() => setMobileOpen(false)}>
                    Certificates
                  </Link>
                )}
                {user.role === "admin" && (
                  <>
                    <Link as={RouterLink} to="/admin/certificates" onClick={() => setMobileOpen(false)}>
                      Certificates
                    </Link>
                  </>
                )}
                <Button size="sm" variant="outline" onClick={() => { setMobileOpen(false); handleLogout(); }}>
                  Log out
                </Button>
              </>
            ) : (
              <HStack spacing={3}>
                <Button as={RouterLink} to="/login" size="sm" variant="outline" onClick={() => setMobileOpen(false)}>
                  Log In
                </Button>
                <Button as={RouterLink} to="/signup" size="sm" colorScheme="teal" onClick={() => setMobileOpen(false)}>
                  Sign Up
                </Button>
              </HStack>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
