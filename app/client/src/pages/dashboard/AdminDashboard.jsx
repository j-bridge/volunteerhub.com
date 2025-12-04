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
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";

const MetricCard = ({ label, value, helper }) => (
  <Stat p={4} borderWidth="1px" borderRadius="lg" bg="white" shadow="sm">
    <StatLabel>{label}</StatLabel>
    <StatNumber>{value}</StatNumber>
    {helper && <StatHelpText>{helper}</StatHelpText>}
  </Stat>
);

const formatDate = (value) => (value ? new Date(value).toLocaleString() : "—");

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [pendingVideos, setPendingVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

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
    <Box bg="gray.50" minH="100vh" py={{ base: 10, md: 16 }}>
      <Container maxW="7xl">
        <Stack spacing={6}>
          <Stack direction={{ base: "column", sm: "row" }} align={{ sm: "center" }} justify="space-between">
            <Heading size="2xl">Admin Dashboard</Heading>
            <Stack direction={{ base: "column", sm: "row" }} spacing={3}>
              <Button variant="outline" onClick={() => navigate("/admin/certificates")}>
                Manage Certificates
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin/users")}>
                Manage Users
              </Button>
              <Button size="sm" colorScheme="teal" onClick={() => { loadSummary(); loadPendingVideos(); }}>
                Refresh Data
              </Button>
            </Stack>
          </Stack>
          <Text color="gray.600">
            Platform health, quick approvals, and recent activity at a glance.
          </Text>

          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            <MetricCard label="Users" value={counts.users || 0} helper={`${counts.admins || 0} admins`} />
            <MetricCard
              label="Organizations"
              value={counts.orgs || 0}
              helper={`${counts.organizations || 0} org roles`}
            />
            <MetricCard
              label="Opportunities"
              value={counts.opportunities || 0}
              helper={`${counts.active_opportunities || 0} active`}
            />
            <MetricCard
              label="Applications"
              value={counts.applications || 0}
              helper="Total submissions"
            />
            <MetricCard
              label="Videos"
              value={counts.video_submissions || 0}
              helper="All submissions"
            />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box borderWidth="1px" borderRadius="lg" bg="white" shadow="sm">
              <Box px={4} py={3} borderBottomWidth="1px">
                <Heading size="md">Recent Users</Heading>
              </Box>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th>Joined</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {(summary?.recent_users || []).map((u) => (
                    <Tr key={u.id}>
                      <Td>{u.email}</Td>
                      <Td>
                        <Badge>{u.role}</Badge>
                      </Td>
                      <Td>{formatDate(u.created_at)}</Td>
                    </Tr>
                  ))}
                  {(!summary?.recent_users || summary.recent_users.length === 0) && (
                    <Tr>
                      <Td colSpan={3}>No users yet.</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>

            <Box borderWidth="1px" borderRadius="lg" bg="white" shadow="sm">
              <Box px={4} py={3} borderBottomWidth="1px">
                <Heading size="md">Recent Opportunities</Heading>
              </Box>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Title</Th>
                    <Th>Org ID</Th>
                    <Th>Created</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {(summary?.recent_opportunities || []).map((o) => (
                    <Tr key={o.id}>
                      <Td>{o.title}</Td>
                      <Td>{o.org_id || "—"}</Td>
                      <Td>{formatDate(o.created_at)}</Td>
                    </Tr>
                  ))}
                  {(!summary?.recent_opportunities || summary.recent_opportunities.length === 0) && (
                    <Tr>
                      <Td colSpan={3}>No opportunities yet.</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box borderWidth="1px" borderRadius="lg" bg="white" shadow="sm">
              <Box px={4} py={3} borderBottomWidth="1px">
                <Heading size="md">Recent Applications</Heading>
              </Box>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Application</Th>
                    <Th>User</Th>
                    <Th>Opportunity</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {(summary?.recent_applications || []).map((a) => (
                    <Tr key={a.id}>
                      <Td>#{a.id}</Td>
                      <Td>{a.user_id}</Td>
                      <Td>{a.opportunity_id}</Td>
                      <Td>
                        <Badge>{a.status}</Badge>
                      </Td>
                    </Tr>
                  ))}
                  {(!summary?.recent_applications || summary.recent_applications.length === 0) && (
                    <Tr>
                      <Td colSpan={4}>No applications yet.</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>

            <Box borderWidth="1px" borderRadius="lg" bg="white" shadow="sm">
              <Box px={4} py={3} borderBottomWidth="1px">
                <Heading size="md">Recent Videos</Heading>
              </Box>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Title</Th>
                    <Th>Author</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {(summary?.recent_videos || []).map((v) => (
                    <Tr key={v.id}>
                      <Td>{v.title}</Td>
                      <Td>{v.user_id}</Td>
                      <Td>
                        <Badge colorScheme={v.status === "approved" ? "green" : "yellow"}>
                          {v.status}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                  {(!summary?.recent_videos || summary.recent_videos.length === 0) && (
                    <Tr>
                      <Td colSpan={3}>No video submissions yet.</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          </SimpleGrid>

          <Box borderWidth="1px" borderRadius="lg" bg="white" shadow="sm">
            <Box px={4} py={3} borderBottomWidth="1px">
              <Heading size="md">Pending Video Approvals</Heading>
            </Box>
            <Box p={4}>
              {pendingVideos.length === 0 ? (
                <Text color="gray.600">No videos waiting for approval.</Text>
              ) : (
                <Stack spacing={3}>
                  {pendingVideos.map((video) => (
                    <Box
                      key={video.id}
                      borderWidth="1px"
                      borderRadius="md"
                      p={3}
                      bg="gray.50"
                    >
                      <Stack direction={{ base: "column", md: "row" }} justify="space-between">
                        <Stack spacing={1}>
                          <Heading size="sm">{video.title}</Heading>
                          <Text fontSize="sm" color="gray.600">
                            From user #{video.user_id} • {formatDate(video.created_at)}
                          </Text>
                          <Text fontSize="sm" color="gray.600" noOfLines={2}>
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

        {loading && <Text mt={4}>Loading admin data...</Text>}
      </Container>
    </Box>
  );
}
