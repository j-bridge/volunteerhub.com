import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  HStack,
  Tag,
  Badge,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { opportunities } from "../../mock/opportunities";

export default function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pageBg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  // Find the opportunity by id (string compare for safety)
  const opportunity = opportunities.find((o) => String(o.id) === String(id));

  if (!opportunity) {
    return (
      <Box bg={pageBg} minH="100vh" py={{ base: 10, md: 16 }}>
        <Container maxW="4xl">
          <Heading size="lg" mb={4}>
            Opportunity not found
          </Heading>
          <Text mb={6} color="gray.600">
            We couldn&apos;t find the opportunity you&apos;re looking for. It may
            have been removed or the link is invalid.
          </Text>
          <Button onClick={() => navigate("/opportunities")} colorScheme="teal">
            Back to opportunities
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={pageBg} minH="100vh" py={{ base: 10, md: 16 }}>
      <Container maxW="4xl">
        <Button
          mb={6}
          variant="ghost"
          onClick={() => navigate("/opportunities")}
        >
          ← Back to opportunities
        </Button>

        <Box
          bg={cardBg}
          borderRadius="2xl"
          p={{ base: 6, md: 8 }}
          boxShadow="sm"
          borderWidth="1px"
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
          <Stack spacing={4}>
            <HStack justify="space-between" align="flex-start">
              <Box>
                <Heading size="xl" mb={2}>
                  {opportunity.title}
                </Heading>
                <Text fontSize="md" color="gray.600">
                  {opportunity.organization}
                </Text>
              </Box>
              {opportunity.category && (
                <Tag size="md" variant="subtle">
                  {opportunity.category}
                </Tag>
              )}
            </HStack>

            <HStack spacing={4} fontSize="sm" color="gray.600">
              <Badge variant="subtle">{opportunity.location}</Badge>
              <Text>
                {new Date(opportunity.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </HStack>

            <Text fontSize="md" color="gray.700">
              {opportunity.description}
            </Text>

            <HStack spacing={3} pt={4}>
              <Button colorScheme="teal" onClick={() => console.log("Apply")}>
                Apply
              </Button>
              <Button variant="outline" onClick={() => console.log("Save")}>
                Save for later
              </Button>
            </HStack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
