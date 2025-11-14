// src/pages/Opportunities/Opportunities.jsx
import { useMemo, useState } from "react";
import {
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Input,
  Select,
} from "@chakra-ui/react";
import OpportunityCard from "./OpportunityCard.jsx";
import { opportunities } from "../../mock/opportunities.js";

export default function Opportunities() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const filtered = useMemo(() => {
    return opportunities.filter((o) => {
      const matchesQ = q
        ? (o.title + o.org + o.description)
            .toLowerCase()
            .includes(q.toLowerCase())
        : true;

      const matchesCat = category ? o.category === category : true;

      const matchesLoc = location
        ? o.location.toLowerCase().includes(location.toLowerCase())
        : true;

      return matchesQ && matchesCat && matchesLoc;
    });
  }, [q, category, location]);

  return (
    <Container maxW="6xl" py={10}>
      <Stack spacing={6}>
        <Heading size="2xl">Discover Opportunities</Heading>

        <Stack direction={{ base: "column", md: "row" }} spacing={4}>
          <Input
            placeholder="Search by title or organization"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Select
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Community">Community</option>
            <option value="Environment">Environment</option>
            <option value="Education">Education</option>
          </Select>
          <Input
            placeholder="Location (e.g., Boca Raton)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Stack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {filtered.map((item) => (
            <OpportunityCard key={item.id} item={item} onView={() => {}} />
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
