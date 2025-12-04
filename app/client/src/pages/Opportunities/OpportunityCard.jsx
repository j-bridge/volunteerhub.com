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
            <Text fontSize="sm" color="gray.600">
              {organization}
            </Text>
          </Box>
          {category && (
            <Tag size="sm" variant="solid" bg="var(--vh-primary)" color="white">
              {category}
            </Tag>
          )}
        </HStack>

        <HStack spacing={4} fontSize="sm" color="gray.600" flexWrap="wrap">
          <Badge variant="subtle" colorScheme="blue">
            {location}
          </Badge>
          <Text color="#2c3e50" fontWeight="600">
            {date}
          </Text>
        </HStack>

        <Text fontSize="sm" color="gray.700" noOfLines={3}>
          {description}
        </Text>

        {tags.length > 0 && (
          <HStack className="opportunity-tags" spacing={2}>
            {tags.map((tag) => (
              <span key={tag} className="opportunity-tag">
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
