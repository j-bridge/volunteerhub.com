// app/client/src/pages/Opportunities/Opportunities.jsx
import { opportunities as mockOpportunities } from "../../mock/opportunities";

import React, { useMemo, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  HStack,
  Input,
  Select,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import OpportunityCard from "./OpportunityCard";
import { useNavigate } from "react-router-dom";   // ⬅️ NEW IMPORT

const Opportunities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  const pageBg = useColorModeValue("gray.50", "gray.900");
  const navigate = useNavigate();                  // ⬅️ NEW HOOK

  const filteredOpportunities = useMemo(() => {
    const now = new Date();

    return mockOpportunities.filter((opp) => {
      const matchesSearch =
        searchTerm.trim().length === 0 ||
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.organization.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = category === "all" || opp.category === category;
      const matchesLocation = location === "all" || opp.location === location;

      let matchesDate = true;
      const oppDate = new Date(opp.date);

      if (dateRange === "upcoming") {
        matchesDate = oppDate >= now;
      } else if (dateRange === "thisMonth") {
        matchesDate =
          oppDate.getMonth() === now.getMonth() &&
          oppDate.getFullYear() === now.getFullYear();
      }

      return matchesSearch && matchesCategory && matchesLocation && matchesDate;
    });
  }, [searchTerm, category, location, dateRange]);

  const handleView = (opp) => {
    // Navigate to the full detail page
    navigate(`/opportunities/${opp.id}`);        // ⬅️ UPDATED
  };

  const handleApply = (opp) => {
    console.log("Apply clicked:", opp);
  };

  const uniqueLocations = Array.from(
    new Set(mockOpportunities.map((o) => o.location))
  );

  return (
    <Box bg={pageBg} minH="100vh" py={{ base: 10, md: 16 }} px={{ base: 4, md: 10 }}>
      <Box maxW="6xl" mx="auto">
        {/* Header */}
        <Stack spacing={4} mb={8}>
          <Heading size="2xl">Explore Opportunities</Heading>
          <Text fontSize="lg" color="gray.600">
            Browse upcoming volunteer events and programs. Use the filters to
            narrow down by category, location, and date.
          </Text>
        </Stack>

        {/* Filters */}
        <Box
          mb={8}
          p={4}
          borderRadius="2xl"
          bg={useColorModeValue("white", "gray.800")}
          boxShadow="sm"
        >
          <Stack spacing={{ base: 4, md: 3 }}>
            <Input
              placeholder="Search by title or organization"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <HStack spacing={3} flexWrap="wrap">
              <Select
                maxW={{ base: "100%", md: "200px" }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="all">All categories</option>
                <option value="Community">Community</option>
                <option value="Environment">Environment</option>
                <option value="Education">Education</option>
              </Select>

              <Select
                maxW={{ base: "100%", md: "240px" }}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="all">All locations</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </Select>

              <Select
                maxW={{ base: "100%", md: "220px" }}
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="all">Any date</option>
                <option value="upcoming">Upcoming only</option>
                <option value="thisMonth">This month</option>
              </Select>

              <Button
                variant="outline"
                ml={{ base: 0, md: "auto" }}
                onClick={() => {
                  setSearchTerm("");
                  setCategory("all");
                  setLocation("all");
                  setDateRange("all");
                }}
              >
                Clear Filters
              </Button>
            </HStack>
          </Stack>
        </Box>

        {/* Opportunities grid */}
        {filteredOpportunities.length === 0 ? (
          <Text color="gray.500">No opportunities match your filters yet.</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {filteredOpportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                title={opp.title}
                organization={opp.organization}
                date={new Date(opp.date).toLocaleDateString()}
                location={opp.location}
                category={opp.category}
                description={opp.description}
                onView={() => handleView(opp)}  // ⬅️ Now navigates correctly
                onApply={() => handleApply(opp)}
              />
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
};

export default Opportunities;
