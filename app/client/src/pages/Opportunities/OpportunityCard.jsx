// app/client/src/pages/Opportunities/OpportunityCard.jsx

import React from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  HStack,
  Tag,
  Button,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";

const OpportunityCard = ({
  title,
  organization,
  date,
  location,
  category,
  description,
  tags = [],
  timeCommitment,
  mode,
  spotsRemaining,
  onView,
  onApply,
  onSelect,
  applied = false,
  applying = false,
  selected = false,
}) => {
  const cardTextSecondary = useColorModeValue("gray.600", "rgba(255,255,255,0.82)");
  const cardTextPrimary = useColorModeValue("gray.800", "rgba(255,255,255,0.9)");
  const dateColor = useColorModeValue("gray.700", "rgba(255,255,255,0.92)");
  const tagBg = useColorModeValue("rgba(0,0,0,0.04)", "rgba(255,255,255,0.12)");
  const tagColor = useColorModeValue("gray.700", "#e5ecf5");

  return (
    <Box
      className="opportunity-card"
      p={6}
      data-title={title}
      data-description={description}
      borderRadius="12px"
      border={selected ? "2px solid var(--vh-primary)" : "none"}
      cursor="pointer"
      onClick={onSelect}
    >
      <Stack spacing={3}>
        <HStack justify="space-between" align="flex-start">
          <Box>
            <Heading size="md" mb={1} color="var(--vh-heading)">
              {title}
            </Heading>
            <Text fontSize="sm" color={cardTextSecondary} className="opp-text-secondary">
              {organization}
            </Text>
          </Box>
          {category && (
            <Tag size="sm" variant="solid" bg="var(--vh-primary)" color="white">
              {category}
            </Tag>
          )}
        </HStack>

        <HStack spacing={4} fontSize="sm" color={cardTextSecondary} className="opp-text-secondary" flexWrap="wrap">
          <Badge variant="subtle" colorScheme="blue">
            {location}
          </Badge>
          <Text color={dateColor} fontWeight="600">
            {date}
          </Text>
        </HStack>

        <Text fontSize="sm" color={cardTextPrimary} noOfLines={3} className="opp-text-primary">
          {description}
        </Text>

        {tags.length > 0 && (
          <HStack className="opportunity-tags" spacing={2}>
            {tags.map((tag) => (
              <span
                key={tag}
                className="opportunity-tag"
                style={{ background: tagBg, color: tagColor }}
              >
                {tag}
              </span>
            ))}
          </HStack>
        )}

        <HStack spacing={3} fontSize="sm" color="gray.700" flexWrap="wrap">
          {mode && <Badge colorScheme="green">{mode}</Badge>}
          {timeCommitment && <Badge colorScheme="purple">{timeCommitment}</Badge>}
          {typeof spotsRemaining === "number" && (
            <Badge colorScheme={spotsRemaining > 5 ? "blue" : "red"}>
              Spots left: {spotsRemaining}
            </Badge>
          )}
        </HStack>

        <HStack spacing={3} pt={2} flexWrap="wrap">
          <Button size="sm" onClick={onView} variant="outline" colorScheme="blue">
            View
          </Button>
          <Button
            className="apply-button"
            size="sm"
            colorScheme="blue"
            onClick={onApply}
            isDisabled={applied}
            bg={applied || applying ? "var(--vh-green)" : "var(--vh-primary)"}
            _hover={{ bg: applied || applying ? "var(--vh-green)" : "#2f89c5" }}
            color="white"
          >
            {applied ? "Applied" : applying ? "Applied! ✓" : "Apply"}
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
};

export default OpportunityCard;
