import { useEffect } from "react";
import { Box, Flex, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ChatWidget from "../components/ChatWidget";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

export default function RootLayout() {
  const pageBg = useColorModeValue("#f2f0eb", "#08141a");
  const { pathname } = useLocation();
  const { colorMode } = useColorMode();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const targets = document.querySelectorAll("[data-reveal], .vh-reveal");
    targets.forEach((el) => observer.observe(el));
    // Fallback: ensure already-visible items are shown if IntersectionObserver lags
    requestAnimationFrame(() => targets.forEach((el) => el.classList.add("is-visible")));

    return () => observer.disconnect();
  }, [pathname, colorMode]);

  return (
    <Flex direction="column" minH="100vh" w="100%">
      <NavBar />
      <ScrollToTop />
      <Box
        as="main"
        flex="1"
        w="100%"
        alignSelf="stretch"
        bg={pageBg}
        position="relative"
        className="vh-reveal is-visible"
        _before={{
          content: '""',
          position: "absolute",
          inset: 0,
          bg: pageBg,
          zIndex: 0,
        }}
      >
        <Box position="relative" zIndex={1}>
        <Outlet />
        </Box>
      </Box>
      <ChatWidget />
      <Footer />
    </Flex>
  );
}
