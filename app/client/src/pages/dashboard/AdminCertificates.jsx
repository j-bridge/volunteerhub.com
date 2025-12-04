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
} from "@chakra-ui/react";
import { api } from "../../api/client";
import useAppToast from "../../hooks/useAppToast";

const formatDate = (value) => (value ? new Date(value).toLocaleString() : "—");

export default function AdminCertificates() {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useAppToast();

  const [form, setForm] = useState({
    volunteerEmail: "",
    organizationId: "",
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
    setLoading(true);
    try {
      const params = {};
      if (selectedOrg) params.organization_id = selectedOrg;
      const res = await api.get("/certificates", { params });
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
    setSubmitting(true);
    try {
      const payload = {
        volunteer_email: form.volunteerEmail || undefined,
        organization_id: Number(form.organizationId || selectedOrg),
        hours: Number(form.hours),
        completed_at: form.completedAt || undefined,
        notes: form.notes || undefined,
      };
      if (!payload.organization_id) {
        throw new Error("Organization is required");
      }
      if (form.opportunityId) payload.opportunity_id = Number(form.opportunityId);
      const res = await api.post("/certificates/", payload);
      toast({
        title: "Certificate issued",
        description: "PDF created and email queued.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setForm({
        volunteerEmail: "",
        organizationId: "",
        hours: "",
        completedAt: "",
        opportunityId: "",
        notes: "",
      });
      setCertificates((cur) => [res.data?.certificate, ...cur]);
    } catch (err) {
      const message = err?.response?.data?.error || err?.message || "Could not issue certificate";
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
    loadCertificates();
  }, []);

  useEffect(() => {
    loadCertificates();
  }, [selectedOrg]);

  return (
    <Box bg="gray.50" minH="100vh" py={{ base: 10, md: 16 }}>
      <Container maxW="7xl">
        <Stack spacing={8}>
          <Heading size="2xl">Certificates (Admin)</Heading>
          <Text color="gray.600">
            Issue certificates on behalf of any organization and view the global ledger of issued PDFs.
          </Text>

          <Box p={6} bg="white" rounded="xl" shadow="md" borderWidth="1px">
            <form onSubmit={handleIssue}>
              <Stack spacing={4}>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Organization</FormLabel>
                    <Select
                      placeholder="Select organization"
                      value={form.organizationId || selectedOrg}
                      onChange={(e) => setForm((f) => ({ ...f, organizationId: e.target.value }))}
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
                      placeholder="e.g., 12"
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
                      placeholder="Link to an opportunity"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Notes (optional)</FormLabel>
                    <Input
                      value={form.notes}
                      onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                      placeholder="Add short remarks"
                    />
                  </FormControl>
                </SimpleGrid>

                <Button type="submit" colorScheme="teal" isLoading={submitting} alignSelf="flex-start">
                  Generate & Email
                </Button>
              </Stack>
            </form>
          </Box>

          <Box p={6} bg="white" rounded="xl" shadow="md" borderWidth="1px">
            <Stack direction={{ base: "column", md: "row" }} justify="space-between" align="center" mb={3}>
              <Heading size="md">Issued Certificates</Heading>
              <Stack direction={{ base: "column", sm: "row" }} spacing={3}>
                <Select
                  placeholder="Filter by org"
                  size="sm"
                  width="220px"
                  value={selectedOrg}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                >
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </Select>
                <Button size="sm" variant="outline" onClick={loadCertificates} isLoading={loading}>
                  Refresh
                </Button>
              </Stack>
            </Stack>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Volunteer</Th>
                  <Th>Organization</Th>
                  <Th>Hours</Th>
                  <Th>Issued</Th>
                  <Th>Download</Th>
                </Tr>
              </Thead>
              <Tbody>
                {(certificates || []).map((c) => (
                  <Tr key={c.id}>
                    <Td>#{c.id}</Td>
                    <Td>{c.volunteer_id}</Td>
                    <Td>{c.organization_id}</Td>
                    <Td>
                      <Badge colorScheme="teal">{c.hours}</Badge>
                    </Td>
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
                      <Text color="gray.600">No certificates issued yet.</Text>
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
