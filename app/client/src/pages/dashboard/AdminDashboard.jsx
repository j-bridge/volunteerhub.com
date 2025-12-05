import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import useAppToast from "../../hooks/useAppToast";

const MetricCard = ({ label, value, helper, cardBg, borderColor, textPrimary, textMuted }) => (
  <Stat p={4} borderWidth="1px" borderRadius="lg" bg={cardBg} borderColor={borderColor} shadow="sm">
    <StatLabel color={textMuted}>{label}</StatLabel>
    <StatNumber color={textPrimary}>{value}</StatNumber>
    {helper && <StatHelpText color={textMuted}>{helper}</StatHelpText>}
  </Stat>
);

const formatDate = (value) => (value ? new Date(value).toLocaleString() : "—");

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [pendingVideos, setPendingVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useAppToast();
  const navigate = useNavigate();
  const pageBg = useColorModeValue("#f2f0eb", "#08141a");
  const cardBg = useColorModeValue("white", "var(--vh-ink-soft)");
  const borderColor = useColorModeValue("rgba(26,165,154,0.25)", "rgba(26,165,154,0.45)");
  const headerBg = useColorModeValue("#f7fafc", "rgba(255,255,255,0.06)");
  const tableBorder = useColorModeValue("#e2e8f0", "rgba(255,255,255,0.08)");
  const textPrimary = useColorModeValue("gray.800", "gray.100");
  const textMuted = useColorModeValue("gray.600", "rgba(231,247,244,0.8)");

  const loadSummary = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/summary");
      setSummary(res.data);
    } catch (err) {
      toast({
        title: "Failed to load admin data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPendingVideos = async () => {
    try {
      const res = await api.get("/videos?status=submitted");
      setPendingVideos(res.data?.videos || []);
    } catch {
      // handled silently; summary call will still render
    }
  };

  const updateVideoStatus = async (id, status) => {
    try {
      await api.patch(`/videos/${id}/status`, { status });
      toast({
        title: `Video ${status}`,
        status: status === "approved" ? "success" : "info",
        duration: 2500,
        isClosable: true,
      });
      setPendingVideos((cur) => cur.filter((v) => v.id !== id));
      loadSummary();
    } catch (err) {
      toast({
        title: "Could not update video",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    loadSummary();
    loadPendingVideos();
  }, []);

  const counts = summary?.counts || {};

  return (
    <Box bg={pageBg} minH="100vh" py={{ base: 10, md: 16 }}>
      <Container maxW="7xl">
        <Stack spacing={6}>
          <Stack direction={{ base: "column", sm: "row" }} align={{ sm: "center" }} justify="space-between">
            <Heading size="2xl" color={textPrimary}>Admin Dashboard</Heading>
            <Stack direction={{ base: "column", sm: "row" }} spacing={3}>
              <Button variant="outline" onClick={() => navigate("/admin/certificates")}>
                Manage Certificates
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin/users")}>
                Manage Users
              </Button>
              <Button variant="outline" onClick={() => navigate("/account")}>
                Account Settings
              </Button>
              <Button size="sm" colorScheme="teal" onClick={() => { loadSummary(); loadPendingVideos(); }}>
                Refresh Data
              </Button>
            </Stack>
          </Stack>
          <Text color={textMuted}>
            Platform health, quick approvals, and recent activity at a glance.
          </Text>

          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            <MetricCard label="Users" value={counts.users || 0} helper={`${counts.admins || 0} admins`} cardBg={cardBg} borderColor={borderColor} textPrimary={textPrimary} textMuted={textMuted} />
            <MetricCard
              label="Organizations"
              value={counts.orgs || 0}
              helper={`${counts.organizations || 0} org roles`}
              cardBg={cardBg}
              borderColor={borderColor}
              textPrimary={textPrimary}
              textMuted={textMuted}
            />
            <MetricCard
              label="Opportunities"
              value={counts.opportunities || 0}
              helper={`${counts.active_opportunities || 0} active`}
              cardBg={cardBg}
              borderColor={borderColor}
              textPrimary={textPrimary}
              textMuted={textMuted}
            />
            <MetricCard
              label="Applications"
              value={counts.applications || 0}
              helper="Total submissions"
              cardBg={cardBg}
              borderColor={borderColor}
              textPrimary={textPrimary}
              textMuted={textMuted}
            />
            <MetricCard
              label="Videos"
              value={counts.video_submissions || 0}
              helper="All submissions"
              cardBg={cardBg}
              borderColor={borderColor}
              textPrimary={textPrimary}
              textMuted={textMuted}
            />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box borderWidth="1px" borderRadius="lg" bg={cardBg} shadow="sm" borderColor={borderColor}>
              <Box px={4} py={3} borderBottomWidth="1px" borderColor={borderColor} bg={headerBg}>
                <Heading size="md" color={textPrimary}>Recent Users</Heading>
              </Box>
              <Table size="sm" variant="simple">
                <Thead bg={headerBg}>
                  <Tr>
                    <Th borderColor={tableBorder}>Email</Th>
                    <Th borderColor={tableBorder}>Role</Th>
                    <Th borderColor={tableBorder}>Joined</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {(summary?.recent_users || []).map((u) => (
                    <Tr key={u.id}>
                      <Td borderColor={tableBorder}>{u.email}</Td>
                      <Td borderColor={tableBorder}>
                        <Badge>{u.role}</Badge>
                      </Td>
                      <Td borderColor={tableBorder}>{formatDate(u.created_at)}</Td>
                    </Tr>
                  ))}
                  {(!summary?.recent_users || summary.recent_users.length === 0) && (
                    <Tr>
                      <Td colSpan={3} borderColor={tableBorder} color={textMuted}>No users yet.</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>

            <Box borderWidth="1px" borderRadius="lg" bg={cardBg} shadow="sm" borderColor={borderColor}>
              <Box px={4} py={3} borderBottomWidth="1px" borderColor={borderColor} bg={headerBg}>
                <Heading size="md" color={textPrimary}>Recent Opportunities</Heading>
              </Box>
              <Table size="sm" variant="simple">
                <Thead bg={headerBg}>
                  <Tr>
                    <Th borderColor={tableBorder}>Title</Th>
                    <Th borderColor={tableBorder}>Org ID</Th>
                    <Th borderColor={tableBorder}>Created</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {(summary?.recent_opportunities || []).map((o) => (
                    <Tr key={o.id}>
                      <Td borderColor={tableBorder}>{o.title}</Td>
                      <Td borderColor={tableBorder}>{o.org_id || "—"}</Td>
                      <Td borderColor={tableBorder}>{formatDate(o.created_at)}</Td>
                    </Tr>
                  ))}
                  {(!summary?.recent_opportunities || summary.recent_opportunities.length === 0) && (
                    <Tr>
                      <Td colSpan={3} borderColor={tableBorder} color={textMuted}>No opportunities yet.</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box borderWidth="1px" borderRadius="lg" bg={cardBg} shadow="sm" borderColor={borderColor}>
              <Box px={4} py={3} borderBottomWidth="1px" borderColor={borderColor} bg={headerBg}>
                <Heading size="md" color={textPrimary}>Recent Applications</Heading>
              </Box>
              <Table size="sm" variant="simple">
                <Thead bg={headerBg}>
                  <Tr>
                    <Th borderColor={tableBorder}>Application</Th>
                    <Th borderColor={tableBorder}>User</Th>
                    <Th borderColor={tableBorder}>Opportunity</Th>
                    <Th borderColor={tableBorder}>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {(summary?.recent_applications || []).map((a) => (
                    <Tr key={a.id}>
                      <Td borderColor={tableBorder}>#{a.id}</Td>
                      <Td borderColor={tableBorder}>{a.user_id}</Td>
                      <Td borderColor={tableBorder}>{a.opportunity_id}</Td>
                      <Td borderColor={tableBorder}>
                        <Badge>{a.status}</Badge>
                      </Td>
                    </Tr>
                  ))}
                  {(!summary?.recent_applications || summary.recent_applications.length === 0) && (
                    <Tr>
                      <Td colSpan={4} borderColor={tableBorder} color={textMuted}>No applications yet.</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>

            <Box borderWidth="1px" borderRadius="lg" bg={cardBg} shadow="sm" borderColor={borderColor}>
              <Box px={4} py={3} borderBottomWidth="1px" borderColor={borderColor} bg={headerBg}>
                <Heading size="md" color={textPrimary}>Recent Videos</Heading>
              </Box>
              <Table size="sm" variant="simple">
                <Thead bg={headerBg}>
                  <Tr>
                    <Th borderColor={tableBorder}>Title</Th>
                    <Th borderColor={tableBorder}>Author</Th>
                    <Th borderColor={tableBorder}>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {(summary?.recent_videos || []).map((v) => (
                    <Tr key={v.id}>
                      <Td borderColor={tableBorder}>{v.title}</Td>
                      <Td borderColor={tableBorder}>{v.user_id}</Td>
                      <Td borderColor={tableBorder}>
                        <Badge colorScheme={v.status === "approved" ? "green" : "yellow"}>
                          {v.status}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                  {(!summary?.recent_videos || summary.recent_videos.length === 0) && (
                    <Tr>
                      <Td colSpan={3} borderColor={tableBorder} color={textMuted}>No video submissions yet.</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          </SimpleGrid>

          <Box borderWidth="1px" borderRadius="lg" bg={cardBg} shadow="sm" borderColor={borderColor}>
            <Box px={4} py={3} borderBottomWidth="1px" borderColor={borderColor} bg={headerBg}>
              <Heading size="md" color={textPrimary}>Pending Video Approvals</Heading>
            </Box>
            <Box p={4}>
              {pendingVideos.length === 0 ? (
                <Text color={textMuted}>No videos waiting for approval.</Text>
              ) : (
                <Stack spacing={3}>
                  {pendingVideos.map((video) => (
                    <Box
                      key={video.id}
                      borderWidth="1px"
                      borderRadius="md"
                      p={3}
                      bg={useColorModeValue("gray.50", "#0e1b20")}
                      borderColor={borderColor}
                    >
                      <Stack direction={{ base: "column", md: "row" }} justify="space-between">
                        <Stack spacing={1}>
                          <Heading size="sm" color={textPrimary}>{video.title}</Heading>
                          <Text fontSize="sm" color={textMuted}>
                            From user #{video.user_id} • {formatDate(video.created_at)}
                          </Text>
                          <Text fontSize="sm" color={textMuted} noOfLines={2}>
                            {video.description || "No description provided."}
                          </Text>
                          <Button
                            as="a"
                            href={video.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="sm"
                            variant="link"
                            colorScheme="teal"
                          >
                            View video link
                          </Button>
                        </Stack>
                        <Stack direction="row" spacing={2} align="center">
                          <Button
                            size="sm"
                            colorScheme="green"
                            onClick={() => updateVideoStatus(video.id, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            colorScheme="red"
                            onClick={() => updateVideoStatus(video.id, "rejected")}
                          >
                            Reject
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Box>
        </Stack>

        {loading && <Text mt={4} color={textMuted}>Loading admin data...</Text>}
      </Container>
    </Box>
  );
}
