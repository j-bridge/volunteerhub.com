// app/client/src/pages/Opportunities/OpportunityCard.jsx
import {
  Box,
  Heading,
  Text,
  Stack,
  Button,
  Badge,
} from "@chakra-ui/react";

export default function OpportunityCard({ item, onView }) {
  return (
    <Box
      bg="white"
      p={6}
      rounded="2xl"
      shadow="md"
      _hover={{ shadow: "lg" }}
      transition="box-shadow .2s"
    >
      <Stack spacing={3}>
        <Stack direction="row" align="center" justify="space-between">
          <Heading size="md">{item.title}</Heading>
          <Badge colorScheme="teal">{item.category}</Badge>
        </Stack>

        <Text color="gray.700">{item.org}</Text>
        <Text color="gray.500" fontSize="sm">
          {item.location} • {new Date(item.date).toLocaleDateString()}
        </Text>

        <Text color="gray.600">{item.description}</Text>

        <Stack direction={{ base: "column", sm: "row" }}>
          <Button variant="outline" onClick={() => onView?.(item)}>
            View
          </Button>
          <Button colorScheme="teal">Apply</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
