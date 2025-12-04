import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { api } from "../../api/client";
import useAppToast from "../../hooks/useAppToast";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "—");

export default function OrgCertificates() {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useAppToast();
  const pageBg = useColorModeValue("gray.50", "#0a121a");
  const cardBg = useColorModeValue("white", "var(--vh-ink-soft)");
  const borderColor = useColorModeValue("rgba(26,165,154,0.25)", "rgba(26,165,154,0.45)");
  const textPrimary = useColorModeValue("#1f262a", "var(--vh-ink-text)");
  const textMuted = useColorModeValue("#4a5561", "rgba(231,247,244,0.78)");

  const [form, setForm] = useState({
    volunteerEmail: "",
    hours: "",
    completedAt: "",
    opportunityId: "",
    notes: "",
  });

  const loadOrganizations = async () => {
    try {
      const res = await api.get("/orgs/");
      const list = res.data?.organizations || [];
      setOrganizations(list);
      if (!selectedOrg && list.length > 0) {
        setSelectedOrg(String(list[0].id));
      }
    } catch (err) {
      toast({
        title: "Could not load organizations",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const loadCertificates = async () => {
    if (!selectedOrg) return;
    setLoading(true);
    try {
      const res = await api.get("/certificates", { params: { organization_id: selectedOrg } });
      setCertificates(res.data?.certificates || []);
    } catch (err) {
      toast({
        title: "Could not fetch certificates",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    if (!selectedOrg) {
      toast({ title: "Select an organization first", status: "warning" });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        organization_id: Number(selectedOrg),
        volunteer_email: form.volunteerEmail || undefined,
        hours: Number(form.hours),
        completed_at: form.completedAt || undefined,
        notes: form.notes || undefined,
      };
      if (form.opportunityId) payload.opportunity_id = Number(form.opportunityId);
      const res = await api.post("/certificates/", payload);
      toast({
        title: "Certificate issued",
        description: "PDF ready and emailed to volunteer.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setForm({ volunteerEmail: "", hours: "", completedAt: "", opportunityId: "", notes: "" });
      setCertificates((cur) => [res.data?.certificate, ...cur]);
    } catch (err) {
      const message = err?.response?.data?.error || "Could not issue certificate";
      toast({ title: message, status: "error", duration: 3000, isClosable: true });
    } finally {
      setSubmitting(false);
    }
  };

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

  useEffect(() => {
    loadOrganizations();
  }, []);

  useEffect(() => {
    loadCertificates();
  }, [selectedOrg]);

  return (
    <Box bg={pageBg} minH="100vh" py={{ base: 10, md: 16 }}>
      <Container maxW="6xl">
        <Stack spacing={8}>
          <Heading size="2xl" color={textPrimary}>Issue Certificates</Heading>
          <Text color={textMuted}>
            Create and email completion certificates to volunteers on behalf of your organization.
          </Text>

          <Box p={6} bg={cardBg} rounded="xl" shadow="md" borderWidth="1px" borderColor={borderColor}>
            <form onSubmit={handleIssue}>
              <Stack spacing={4}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Organization</FormLabel>
                    <Select
                      placeholder="Select organization"
                      value={selectedOrg}
                      onChange={(e) => setSelectedOrg(e.target.value)}
                    >
                      {organizations.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Volunteer email</FormLabel>
                    <Input
                      type="email"
                      value={form.volunteerEmail}
                      onChange={(e) => setForm((f) => ({ ...f, volunteerEmail: e.target.value }))}
                      placeholder="volunteer@example.com"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Hours</FormLabel>
                    <Input
                      type="number"
                      min="0"
                      step="0.25"
                      value={form.hours}
                      onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))}
                      placeholder="e.g., 8"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Completed on</FormLabel>
                    <Input
                      type="date"
                      value={form.completedAt}
                      onChange={(e) => setForm((f) => ({ ...f, completedAt: e.target.value }))}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Opportunity ID (optional)</FormLabel>
                    <Input
                      type="number"
                      value={form.opportunityId}
                      onChange={(e) => setForm((f) => ({ ...f, opportunityId: e.target.value }))}
                      placeholder="Match the opportunity record"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Notes (optional)</FormLabel>
                    <Input
                      value={form.notes}
                      onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                      placeholder="Highlight impact or role"
                    />
                  </FormControl>
                </SimpleGrid>

                <Button type="submit" colorScheme="teal" isLoading={submitting} alignSelf="flex-start">
                  Generate & Email
                </Button>
              </Stack>
            </form>
          </Box>

          <Box p={6} bg={cardBg} rounded="xl" shadow="md" borderWidth="1px" borderColor={borderColor}>
            <Stack direction={{ base: "column", md: "row" }} justify="space-between" align="center" mb={3}>
              <Heading size="md" color={textPrimary}>Recent Certificates</Heading>
              <Button size="sm" variant="outline" onClick={loadCertificates} isLoading={loading}>
                Refresh
              </Button>
            </Stack>
            <Table size="sm" color={textPrimary}>
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Volunteer</Th>
                  <Th>Hours</Th>
                  <Th>Completed</Th>
                  <Th>Issued</Th>
                  <Th>Download</Th>
                </Tr>
              </Thead>
              <Tbody>
                {(certificates || []).map((c) => (
                  <Tr key={c.id}>
                    <Td>#{c.id}</Td>
                    <Td>{c.volunteer_id}</Td>
                    <Td>
                      <Badge colorScheme="teal">{c.hours}</Badge>
                    </Td>
                    <Td>{formatDate(c.completed_at)}</Td>
                    <Td>{formatDate(c.issued_at)}</Td>
                    <Td>
                      {c.download_url ? (
                        <Button size="xs" variant="outline" onClick={() => downloadPdf(c)}>
                          Download
                        </Button>
                      ) : (
                        <Text color="gray.500">—</Text>
                      )}
                    </Td>
                  </Tr>
                ))}
                {(!certificates || certificates.length === 0) && (
                  <Tr>
                    <Td colSpan={6}>
                      <Text color="gray.600">No certificates yet.</Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
