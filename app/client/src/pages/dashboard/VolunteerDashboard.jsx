import { useEffect, useState } from "react";
import {
  Container,
  Heading,
  Stack,
  SimpleGrid,
  Box,
  Text,
  Button,
  Badge,
  Link,
} from "@chakra-ui/react";
import { opportunities } from "../../mock/opportunities";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useColorModeValue } from "@chakra-ui/react";
import { api } from "../../api/client";
import useAppToast from "../../hooks/useAppToast";

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const { user, cancelApplication, removeSavedOpportunity } = useAuth();
  const toast = useAppToast();
  const cardBg = useColorModeValue("white", "var(--vh-ink-soft)");
  const panelBg = useColorModeValue("white", "#0b1f24");
  const textPrimary = useColorModeValue("#1f262a", "var(--vh-ink-text)");
  const textMuted = useColorModeValue("#4a5561", "rgba(231,247,244,0.72)");
  const borderColor = useColorModeValue("rgba(26,165,154,0.25)", "rgba(26,165,154,0.4)");
  const chipBg = useColorModeValue("gray.50", "rgba(26,165,154,0.12)");
  const chipBorder = useColorModeValue("rgba(0,0,0,0.06)", "rgba(26,165,154,0.3)");

  const applied = user?.appliedOpportunities || [];
  const saved = user?.savedOpportunities || [];
  const upcoming = opportunities.slice(0, 3); // simple subset for now
  const [certificates, setCertificates] = useState([]);

  const loadCertificates = async () => {
    try {
      const res = await api.get("/certificates");
      setCertificates(res.data?.certificates || []);
    } catch (err) {
      toast({
        title: "Could not load certificates",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const downloadPdf = async (cert) => {
    if (!cert?.id) return;
    try {
      const res = await api.get(cert.download_path || `/certificates/${cert.id}/pdf`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${cert.id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast({ title: "Could not download certificate", status: "error", duration: 2500, isClosable: true });
    }
  };

  return (
    <Container maxW="6xl" py={10}>
      <Stack spacing={8}>
        <Stack direction={{ base: "column", sm: "row" }} justify="space-between" align={{ base: "flex-start", sm: "center" }}>
          <Heading size="2xl" color={textPrimary}>
            My Dashboard
          </Heading>
          <Button variant="outline" size="sm" onClick={() => navigate("/account")}>
            Account Settings
          </Button>
        </Stack>

        {/* Quick actions / overview */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          {/* My Applications */}
          <Box p={6} bg={cardBg} rounded="2xl" shadow="md" border={`1px solid ${borderColor}`}>
            <Heading size="md" mb={2} color={textPrimary}>
              My Applications
            </Heading>
            {applied.length === 0 ? (
              <>
                <Text color={textMuted}>
                  You haven&apos;t applied to any opportunities yet.
                </Text>
                <Button
                  mt={4}
                  variant="outline"
                  onClick={() => navigate("/opportunities")}
                >
                  Find Opportunities
                </Button>
              </>
            ) : (
              <Stack spacing={3} mt={3}>
                {applied.map((opp) => (
                  <Box
                    key={opp.id}
                    p={3}
                    bg={chipBg}
                    rounded="md"
                    border={`1px solid ${chipBorder}`}
                  >
                    <Text fontWeight="semibold" color={textPrimary}>
                      {opp.title}
                    </Text>
                    <Text fontSize="sm" color={textMuted}>
                      {opp.organization} • {opp.location}
                    </Text>
                    <Text fontSize="sm" color={textMuted}>
                      {opp.date
                        ? new Date(opp.date).toLocaleDateString()
                        : "Date TBD"}
                    </Text>
                    <Button
                      size="xs"
                      mt={2}
                      mr={2}
                      onClick={() => navigate(`/opportunities/${opp.id}`)}
                    >
                      View
                    </Button>
                    <Button
                      size="xs"
                      variant="outline"
                      colorScheme="red"
                      onClick={() => cancelApplication(opp.id)}
                    >
                      Cancel
                    </Button>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>

          {/* Saved Opportunities */}
          <Box p={6} bg={cardBg} rounded="2xl" shadow="md" border={`1px solid ${borderColor}`}>
            <Heading size="md" mb={2} color={textPrimary}>
              Saved Opportunities
            </Heading>
            {saved.length === 0 ? (
              <Text color={textMuted}>
                Save roles you&apos;re interested in and they&apos;ll show up here.
              </Text>
            ) : (
              <Stack spacing={3} mt={2}>
                {saved.map((opp) => (
                  <Box
                    key={opp.id}
                    p={3}
                    bg={chipBg}
                    rounded="md"
                    border={`1px solid ${chipBorder}`}
                  >
                    <Text fontWeight="semibold" color={textPrimary}>
                      {opp.title}
                    </Text>
                    <Text fontSize="sm" color={textMuted}>
                      {opp.organization} • {opp.location}
                    </Text>
                    <Button
                      size="xs"
                      mt={2}
                      mr={2}
                      onClick={() => navigate(`/opportunities/${opp.id}`)}
                    >
                      View
                    </Button>
                    <Button
                      size="xs"
                      variant="outline"
                      colorScheme="red"
                      onClick={() => removeSavedOpportunity(opp.id)}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>

          {/* Recommended Opportunities */}
          <Box p={6} bg={cardBg} rounded="2xl" shadow="md" border={`1px solid ${borderColor}`}>
            <Heading size="md" mb={2} color={textPrimary}>
              Recommended Opportunities
            </Heading>
            <Text color={textMuted}>
              Once recommendations are set up, personalized suggestions will
              appear here.
            </Text>
          </Box>
        </SimpleGrid>

        {/* Certificates */}
        <Box p={6} bg={cardBg} rounded="2xl" shadow="md" border={`1px solid ${borderColor}`}>
          <Heading size="lg" mb={3} color={textPrimary}>
            My Certificates
          </Heading>
          {certificates.length === 0 ? (
            <Text color={textMuted}>Certificates you earn will appear here with download links.</Text>
          ) : (
            <Stack spacing={3}>
              {certificates.map((cert) => (
                <Box
                  key={cert.id}
                  p={3}
                  bg={chipBg}
                  rounded="md"
                  border={`1px solid ${chipBorder}`}
                >
                  <Stack direction={{ base: "column", sm: "row" }} justify="space-between" align={{ sm: "center" }}>
                    <Stack spacing={1}>
                      <Text fontWeight="semibold" color={textPrimary}>
                        {cert.organization_id ? `Org #${cert.organization_id}` : "Organization"}
                      </Text>
                      <Text fontSize="sm" color={textMuted}>
                        {cert.hours} hours • Issued {cert.issued_at ? new Date(cert.issued_at).toLocaleDateString() : ""}
                      </Text>
                    </Stack>
                    {cert.download_url ? (
                      <Button size="xs" variant="outline" onClick={() => downloadPdf(cert)}>
                        Download
                      </Button>
                    ) : (
                      <Text fontSize="sm" color={textMuted}>
                        Generating PDF…
                      </Text>
                    )}
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Box>

        {/* Upcoming opportunities list */}
        <Box mt={4}>
          <Heading size="lg" mb={4} color={textPrimary}>
            Upcoming Opportunities
          </Heading>
          {upcoming.length === 0 ? (
            <Text color={textMuted}>
              No upcoming opportunities yet. Check the opportunities page to
              explore more.
            </Text>
          ) : (
            <Stack spacing={3}>
              {upcoming.map((opp) => (
                <Box
                  key={opp.id}
                  p={4}
                  bg={panelBg}
                  rounded="xl"
                  shadow="sm"
                  border={`1px solid ${borderColor}`}
                >
                  <Heading size="sm" mb={1} color={textPrimary}>
                    {opp.title}
                  </Heading>
                  <Text fontSize="sm" color={textMuted}>
                    {opp.organization} • {opp.location}
                  </Text>
                  <Text fontSize="sm" color={textMuted}>
                    {new Date(opp.date).toLocaleDateString()}
                  </Text>
                  {opp.category && (
                    <Badge mt={2} variant="subtle" colorScheme="teal">
                      {opp.category}
                    </Badge>
                  )}
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </Container>
  );
}
