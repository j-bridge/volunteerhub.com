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
  onView,
  onApply,
  applied = false,
}) => {
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <Box
      bg={cardBg}
      borderRadius="2xl"
      p={6}
      boxShadow="sm"
      borderWidth="1px"
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      <Stack spacing={3}>
        <HStack justify="space-between" align="flex-start">
          <Box>
            <Heading size="md" mb={1}>
              {title}
            </Heading>
            <Text fontSize="sm" color="gray.600">
              {organization}
            </Text>
          </Box>
          {category && (
            <Tag size="sm" variant="subtle">
              {category}
            </Tag>
          )}
        </HStack>

        <HStack spacing={4} fontSize="sm" color="gray.600">
          <Badge variant="subtle">{location}</Badge>
          <Text>{date}</Text>
        </HStack>

        <Text fontSize="sm" color="gray.700" noOfLines={3}>
          {description}
        </Text>

        <HStack spacing={3} pt={2}>
          <Button size="sm" onClick={onView}>
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onApply}
            isDisabled={applied}
          >
            {applied ? "Applied" : "Apply"}
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
};

export default OpportunityCard;

