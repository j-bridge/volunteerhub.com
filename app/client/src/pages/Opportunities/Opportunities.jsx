import { opportunities as mockOpportunities } from "../../mock/opportunities";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  HStack,
  Input,
  Select,
  Button,
  useColorModeValue,
  useBreakpointValue,
  useToast,
  Badge,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import OpportunityCard from "./OpportunityCard";
import { useAuth } from "../../context/AuthContext";

const normalizeText = (text = "") =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const levenshtein = (a, b) => {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
};

const fuzzyIncludes = (needle, haystack) => {
  const n = normalizeText(needle);
  const h = normalizeText(haystack);
  if (!n) return true;
  if (h.includes(n)) return true;

  const words = h.split(" ");
  const tokens = n.split(" ");
  return tokens.every((token) =>
    words.some((word) => levenshtein(word, token) <= Math.max(1, Math.floor(token.length / 3)))
  );
};

const Opportunities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [mode, setMode] = useState("all");
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [applyingId, setApplyingId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const pageBg = useColorModeValue("#f2f0eb", "#08141a");
  const surfaceBg = useColorModeValue("#f8f6f2", "var(--vh-ink-soft)");
  const inputBg = useColorModeValue("#ffffff", "#0b1f24");
  const inkAccent = useColorModeValue("#1aa59a", "#0f6c5f"); // darker accent in dark mode
  const inkText = useColorModeValue("#1f262a", "var(--vh-ink-text)");
  const inkMuted = useColorModeValue("#4a5561", "var(--vh-ink-muted)");
  const socialBg = useColorModeValue("rgba(26,165,154,0.12)", "rgba(15,108,95,0.18)");
  const socialBorder = useColorModeValue("rgba(26,165,154,0.35)", "rgba(15,108,95,0.45)");
  const filterBorder = useColorModeValue("rgba(26,165,154,0.35)", "rgba(15,108,95,0.45)");
  const filterFocusStrong = useColorModeValue("rgba(26,165,154,0.7)", "rgba(15,108,95,0.7)");
  const filterFocus = useColorModeValue("rgba(26,165,154,0.6)", "rgba(15,108,95,0.6)");
  const filterFocusBg = useColorModeValue("#ffffff", "#0d252b");
  const filterPlaceholder = useColorModeValue("#5b6571", "rgba(231,247,244,0.7)");
  const filterHover = useColorModeValue("rgba(26,165,154,0.1)", "rgba(15,108,95,0.12)");
  const clearBorder = useColorModeValue("rgba(26,165,154,0.45)", "rgba(15,108,95,0.6)");
  const surfaceBorder = useColorModeValue("rgba(26,165,154,0.28)", "rgba(15,108,95,0.45)");
  const imageBorder = useColorModeValue("rgba(26,165,154,0.25)", "rgba(15,108,95,0.35)");
  const badgeLocationBg = useColorModeValue("rgba(26,165,154,0.12)", "rgba(15,108,95,0.16)");
  const badgeLocationBorder = useColorModeValue("rgba(26,165,154,0.3)", "rgba(15,108,95,0.4)");
  const badgeModeBg = useColorModeValue("rgba(26,165,154,0.1)", "rgba(15,108,95,0.14)");
  const badgeModeBorder = useColorModeValue("rgba(26,165,154,0.28)", "rgba(15,108,95,0.38)");
  const timeBg = useColorModeValue("rgba(74,85,97,0.14)", "rgba(215,189,255,0.14)");
  const timeBorder = useColorModeValue("rgba(74,85,97,0.3)", "rgba(215,189,255,0.35)");
  const spotsBgEnough = useColorModeValue("rgba(26,165,154,0.14)", "rgba(15,108,95,0.16)");
  const spotsBgLow = useColorModeValue("rgba(255,99,99,0.12)", "rgba(255,99,99,0.16)");
  const spotsBorderEnough = useColorModeValue("rgba(26,165,154,0.4)", "rgba(15,108,95,0.5)");
  const buttonText = useColorModeValue("#0f252b", "#0b1618");
  const buttonHover = useColorModeValue("#1fb9ae", "#0f7c70");
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const [filterState, setFilterState] = useState("expanded"); // expanded | condensed | hidden
  const toast = useToast();
  const navigate = useNavigate();
  const { user, applyToOpportunity } = useAuth();

  const filteredOpportunities = useMemo(() => {
    const now = new Date();

    return mockOpportunities.filter((opp) => {
      const matchesSearch =
        searchTerm.trim().length === 0 ||
        fuzzyIncludes(searchTerm, opp.title) ||
        fuzzyIncludes(searchTerm, opp.organization) ||
        fuzzyIncludes(searchTerm, opp.description || "") ||
        fuzzyIncludes(searchTerm, (opp.tags || []).join(" "));

      const matchesCategory = category === "all" || opp.category === category;
      const matchesLocation =
        location === "all" ||
        fuzzyIncludes(location, opp.location) ||
        fuzzyIncludes(opp.location, location);
      const matchesMode = mode === "all" || (opp.mode || "").toLowerCase() === mode.toLowerCase();

      let matchesDate = true;
      const oppDate = new Date(opp.date);

      if (dateRange === "upcoming") {
        matchesDate = oppDate >= now;
      } else if (dateRange === "thisMonth") {
        matchesDate =
          oppDate.getMonth() === now.getMonth() &&
          oppDate.getFullYear() === now.getFullYear();
      }

      return matchesSearch && matchesCategory && matchesLocation && matchesMode && matchesDate;
    });
  }, [searchTerm, category, location, dateRange, mode]);

  useEffect(() => {
    if (!selectedOpp && filteredOpportunities.length > 0) {
      setSelectedOpp(filteredOpportunities[0]);
    } else if (selectedOpp && !filteredOpportunities.find((o) => o.id === selectedOpp.id)) {
      setSelectedOpp(filteredOpportunities[0] || null);
    }
  }, [filteredOpportunities, selectedOpp]);

  const hasApplied = (id) =>
    !!user?.appliedOpportunities?.some((o) => String(o.id) === String(id));

  const handleView = (opp) => {
    navigate(`/opportunities/${opp.id}`);
  };

  const handleApply = (opp) => {
    // Not logged in → send them to login and let Login show the message
    if (!user) {
      navigate("/login", { state: { fromApply: true } });
      return;
    }

    // Logged in, but not a volunteer
    if (user.role !== "volunteer") {
      toast({
        title: "Volunteer account required",
        description:
          "Only volunteer accounts can apply for opportunities. Please sign in with a volunteer account or create one.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (hasApplied(opp.id)) {
      toast({
        title: "Already applied",
        description: "You have already applied for this opportunity.",
        status: "info",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    const confirmed = window.confirm(`Apply for "${opp.title}" at ${opp.organization}?`);
    if (!confirmed) return;

    setApplyingId(opp.id);
    const summary = {
      id: opp.id,
      title: opp.title,
      organization: opp.organization,
      date: opp.date,
      location: opp.location,
      category: opp.category,
    };

    setTimeout(() => {
      applyToOpportunity(summary);

      toast({
        title: "Application recorded",
        description: "This opportunity now appears in your dashboard.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setApplyingId(null);
    }, 800);
  };

  const uniqueLocations = Array.from(
    new Set(mockOpportunities.map((o) => o.location))
  );

  // Live filter listener per requirements (client-side DOM toggle)
  const domFilter = useCallback(
    (value) => {
      const term = (value || "").toLowerCase();
      document.querySelectorAll(".opportunity-card").forEach((card) => {
        const title = (card.getAttribute("data-title") || "").toLowerCase();
        const desc = (card.getAttribute("data-description") || "").toLowerCase();
        const match = !term || title.includes(term) || desc.includes(term);
        card.style.display = match ? "flex" : "none";
      });
    },
    []
  );

  useEffect(() => {
    const input = document.getElementById("search-opportunities");
    if (!input) return;
    const handler = (e) => domFilter(e.target.value);
    input.addEventListener("input", handler);
    return () => input.removeEventListener("input", handler);
  }, [domFilter]);

  useEffect(() => {
    if (!isMobile) return undefined;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const atTop = y < 40;
      const direction = y > lastY ? "down" : "up";

      if (atTop) {
        setFilterState("expanded");
      } else if (direction === "up") {
        setFilterState("condensed");
      } else {
        setFilterState("hidden");
      }

      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  const baseFilterBoxShadow = "0 20px 50px rgba(0,0,0,0.32)";
  const baseFilterBorder = `1px solid ${surfaceBorder}`;

  const mobileFilterStyles =
    isMobile === undefined || isMobile === null || isMobile === false
      ? {
          position: "sticky",
          top: "90px",
          opacity: 1,
          transform: "none",
          boxShadow: baseFilterBoxShadow,
          border: baseFilterBorder,
        }
      : {
          position: "sticky",
          top: filterState === "expanded" ? "80px" : "12px",
          zIndex: 20,
          maxHeight:
            filterState === "hidden"
              ? "0px"
              : filterState === "condensed"
              ? "30vh"
              : "60vh",
          minHeight: filterState === "hidden" ? "0px" : "auto",
          overflowY: filterState === "hidden" ? "hidden" : "auto",
          overscrollBehavior: "contain",
          opacity: filterState === "hidden" ? 0 : 0.98,
          pointerEvents: filterState === "hidden" ? "none" : "auto",
          transform:
            filterState === "hidden"
              ? "translateY(-24px) scale(0.96)"
              : filterState === "condensed"
              ? "translateY(0) scale(0.97)"
              : "translateY(0) scale(1)",
          p: filterState === "expanded" ? 5 : filterState === "condensed" ? 3 : 0,
          boxShadow: filterState === "hidden" ? "none" : baseFilterBoxShadow,
          border: filterState === "hidden" ? "0 solid transparent" : baseFilterBorder,
          transition: "all 0.22s ease",
        };

  return (
    <Box
      className="vh-page-bg"
      bg={pageBg}
      color={inkText}
      minH="100vh"
      pt={{ base: 10, md: 16 }}
      pb={{ base: 6, md: 8 }}
      px={{ base: 4, md: 10 }}
    >
      <Box maxW="7xl" mx="auto">
        {/* Header */}
        <Stack spacing={4} mb={8}>
          <Heading size="2xl" color={inkText}>
            Explore Opportunities
          </Heading>
          <Text fontSize="lg" color={inkMuted}>
            Browse upcoming volunteer events and programs. Use the filters to narrow down by category, location, and date.
          </Text>
          <Box
            className="vh-social-proof"
            bg={socialBg}
            borderColor={socialBorder}
            color={inkText}
          >
            <Text fontWeight="700">1,250 Volunteer Hours Contributed this Month!</Text>
          </Box>
        </Stack>

        <HStack align="flex-start" spacing={6} flexWrap="wrap">
          {/* Sidebar Filters */}
          <Box
            flexBasis={{ base: "100%", lg: "300px" }}
            flexShrink={0}
            bg={surfaceBg}
            borderRadius="xl"
            p={5}
            {...mobileFilterStyles}
            color={inkText}
          >
            <Heading size="sm" mb={3} color={inkText} letterSpacing="0.5px">
              Filters
            </Heading>
            <Stack spacing={3}>
              <Input
                id="search-opportunities"
                placeholder="Search by title or organization"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg={inputBg}
                color={inkText}
                borderColor={filterBorder}
                _placeholder={{ color: filterPlaceholder }}
                _focus={{
                  borderColor: inkAccent,
                  boxShadow: `0 0 0 1px ${filterFocusStrong}`,
                  bg: filterFocusBg,
                }}
              />
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                bg={inputBg}
                color={inkText}
                borderColor={filterBorder}
                _focus={{
                  borderColor: inkAccent,
                  boxShadow: `0 0 0 1px ${filterFocus}`,
                }}
              >
                <option value="all">All categories</option>
                <option value="Community">Community</option>
                <option value="Environment">Environment</option>
                <option value="Education">Education</option>
              </Select>
              <Select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                bg={inputBg}
                color={inkText}
                borderColor={filterBorder}
                _focus={{
                  borderColor: inkAccent,
                  boxShadow: `0 0 0 1px ${filterFocus}`,
                }}
              >
                <option value="all">All locations</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </Select>
              <Select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                bg={inputBg}
                color={inkText}
                borderColor={filterBorder}
                _focus={{
                  borderColor: inkAccent,
                  boxShadow: `0 0 0 1px ${filterFocus}`,
                }}
              >
                <option value="all">Any mode</option>
                <option value="Remote">Remote</option>
                <option value="In-person">In-person</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Outdoor">Outdoor</option>
              </Select>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                bg={inputBg}
                color={inkText}
                borderColor={filterBorder}
                _focus={{
                  borderColor: inkAccent,
                  boxShadow: `0 0 0 1px ${filterFocus}`,
                }}
              >
                <option value="all">Any date</option>
                <option value="upcoming">Upcoming only</option>
                <option value="thisMonth">This month</option>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setCategory("all");
                  setLocation("all");
                  setDateRange("all");
                  setMode("all");
                  setSelectedOpp(filteredOpportunities[0] || null);
                }}
                color={inkText}
                borderColor={clearBorder}
                _hover={{
                  bg: filterHover,
                  borderColor: inkAccent,
                }}
              >
                Clear Filters
              </Button>
            </Stack>
          </Box>

          {/* Main content */}
          <Box flex="1">
            {filteredOpportunities.length === 0 ? (
              <Text color={inkMuted}>No opportunities match your filters yet.</Text>
            ) : (
              <HStack align="flex-start" spacing={4} flexWrap="wrap">
                <Box flex="1" minW={{ base: "100%", md: "55%" }}>
                  <div className="opportunity-grid">
                    {filteredOpportunities
                      .filter((opp) => {
                        if (mode === "all") return true;
                        return (opp.mode || "").toLowerCase() === mode.toLowerCase();
                      })
                      .slice(0, visibleCount)
                      .map((opp) => {
                        const tags = [
                          opp.category,
                          opp.location,
                          opp.mode,
                          opp.location?.toLowerCase().includes("online") ? "Remote" : null,
                          ...(opp.tags || []),
                        ].filter(Boolean);
                        return (
                          <OpportunityCard
                            key={opp.id}
                            title={opp.title}
                            organization={opp.organization}
                            date={new Date(opp.date).toLocaleDateString()}
                            location={opp.location}
                            category={opp.category}
                            description={opp.description}
                            tags={tags}
                            timeCommitment={opp.timeCommitment}
                            mode={opp.mode}
                            spotsRemaining={opp.spotsRemaining}
                            onView={() => handleView(opp)}
                            onApply={() => handleApply(opp)}
                            onSelect={() => setSelectedOpp(opp)}
                            selected={selectedOpp?.id === opp.id}
                            applied={hasApplied(opp.id)}
                            applying={applyingId === opp.id}
                          />
                        );
                      })}
                  </div>
                  {filteredOpportunities.length > visibleCount && (
                    <Button
                      mt={4}
                      variant="outline"
                      onClick={() => setVisibleCount((c) => c + 10)}
                      w="100%"
                      color={inkText}
                      borderColor={clearBorder}
                      _hover={{
                        bg: filterHover,
                        borderColor: inkAccent,
                      }}
                    >
                      Load more opportunities
                    </Button>
                  )}
                </Box>

                <Box
                  flexBasis={{ base: "100%", md: "40%" }}
                  bg={surfaceBg}
                  color={inkText}
                  p={5}
                  borderRadius="xl"
                  boxShadow="0 24px 60px rgba(0,0,0,0.35)"
                  border={`1px solid ${surfaceBorder}`}
                  position={{ base: "relative", md: "sticky" }}
                  top={{ base: "auto", md: "90px" }}
                >
                  <Heading size="md" mb={3} color={inkText}>
                    Opportunity Preview
                  </Heading>
                  <Image
                    src="/images/vhub2.jpg"
                    alt="Opportunity preview"
                    borderRadius="lg"
                    mb={3}
                    objectFit="cover"
                    w="100%"
                    maxH="200px"
                    border={`1px solid ${imageBorder}`}
                  />
                  {selectedOpp ? (
                    <Stack spacing={3}>
                      <Heading size="sm" color={inkText}>
                        {selectedOpp.title}
                      </Heading>
                      <Text fontWeight="600" color={inkMuted}>
                        {selectedOpp.organization}
                      </Text>
                      <HStack spacing={3} fontSize="sm" color={inkMuted} flexWrap="wrap">
                        <Badge
                          bg={badgeLocationBg}
                          color={inkText}
                          border={`1px solid ${badgeLocationBorder}`}
                        >
                          {selectedOpp.location}
                        </Badge>
                        {selectedOpp.mode && (
                          <Badge
                            bg={badgeModeBg}
                            color={inkText}
                            border={`1px solid ${badgeModeBorder}`}
                          >
                            {selectedOpp.mode}
                          </Badge>
                        )}
                        {selectedOpp.timeCommitment && (
                          <Badge
                            bg={timeBg}
                            color={inkText}
                            border={`1px solid ${timeBorder}`}
                          >
                            {selectedOpp.timeCommitment}
                          </Badge>
                        )}
                        {typeof selectedOpp.spotsRemaining === "number" && (
                          <Badge
                            bg={
                              selectedOpp.spotsRemaining > 5
                                ? spotsBgEnough
                                : spotsBgLow
                            }
                            color={inkText}
                            border={
                              selectedOpp.spotsRemaining > 5
                                ? `1px solid ${spotsBorderEnough}`
                                : "1px solid rgba(255,99,99,0.5)"
                            }
                          >
                            Spots left: {selectedOpp.spotsRemaining}
                          </Badge>
                        )}
                      </HStack>
                      <Text fontSize="sm" color={inkText}>
                        {selectedOpp.description}
                      </Text>
                      {selectedOpp.skills && (
                        <Stack spacing={1}>
                          <Text fontWeight="700" fontSize="sm" color={inkText}>
                            Skills
                          </Text>
                          <HStack spacing={2} flexWrap="wrap">
                            {selectedOpp.skills.map((s) => (
                              <Badge
                                key={s}
                                bg="rgba(24,178,165,0.18)"
                                color={inkText}
                                border="1px solid rgba(24,178,165,0.35)"
                              >
                                {s}
                              </Badge>
                            ))}
                          </HStack>
                        </Stack>
                      )}
                      <Text fontSize="sm" color={inkMuted}>
                        Contact: {selectedOpp.contactEmail}{" "}
                        {selectedOpp.contactPhone ? `• ${selectedOpp.contactPhone}` : ""}
                      </Text>
                      <HStack spacing={3} pt={2}>
                        <Button
                          bg={inkAccent}
                          color={buttonText}
                          _hover={{ bg: buttonHover }}
                          onClick={() => handleApply(selectedOpp)}
                        >
                          {hasApplied(selectedOpp.id) ? "Applied" : "Apply"}
                        </Button>
                        <Button
                          variant="outline"
                          color={inkText}
                          borderColor={clearBorder}
                          _hover={{
                            bg: filterHover,
                            borderColor: inkAccent,
                          }}
                          onClick={() => handleView(selectedOpp)}
                        >
                          View Details
                        </Button>
                      </HStack>
                    </Stack>
                  ) : (
                    <Text color={inkMuted}>Select an opportunity to preview details.</Text>
                  )}
                </Box>
              </HStack>
            )}
          </Box>
        </HStack>
      </Box>
    </Box>
  );
};

export default Opportunities;
