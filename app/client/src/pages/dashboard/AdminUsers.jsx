import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { api } from "../../api/client";
import useAppToast from "../../hooks/useAppToast";

const emptyUser = (u = {}) => ({
  id: u.id,
  email: u.email || "",
  name: u.name || "",
  role: u.role || "volunteer",
  created_at: u.created_at,
});

export default function AdminUsers() {
  const toast = useAppToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const pageBg = useColorModeValue("#f2f0eb", "#08141a");
  const cardBg = useColorModeValue("white", "var(--vh-ink-soft)");
  const borderColor = useColorModeValue("rgba(26,165,154,0.25)", "rgba(26,165,154,0.45)");
  const textPrimary = useColorModeValue("gray.800", "gray.100");
  const textMuted = useColorModeValue("gray.600", "rgba(231,247,244,0.75)");
  const headerBg = useColorModeValue("#f7fafc", "rgba(255,255,255,0.04)");
  const tableBorder = useColorModeValue("#e2e8f0", "rgba(255,255,255,0.08)");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      const rows = (res.data?.users || []).map(emptyUser);
      setUsers(rows);
    } catch (err) {
      toast({ title: "Failed to load users", status: "error", duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (user) => {
    setSavingId(user.id);
    try {
      const payload = { name: user.name, email: user.email, role: user.role };
      const res = await api.patch(`/users/${user.id}`, payload);
      const updated = emptyUser(res.data?.user);
      setUsers((cur) => cur.map((u) => (u.id === updated.id ? updated : u)));
      toast({ title: "User updated", status: "success", duration: 2000, isClosable: true });
    } catch (err) {
      const msg = err?.response?.data?.error || "Update failed";
      toast({ title: msg, status: "error", duration: 3000, isClosable: true });
    } finally {
      setSavingId(null);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleFieldChange = (id, field, value) => {
    setUsers((cur) => cur.map((u) => (u.id === id ? { ...u, [field]: value } : u)));
  };

  const handleDelete = async (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    const ok = window.confirm(`Delete user ${user.email}? This cannot be undone.`);
    if (!ok) return;
    setDeletingId(userId);
    try {
      await api.delete(`/users/${userId}`);
      setUsers((cur) => cur.filter((u) => u.id !== userId));
      toast({ title: "User deleted", status: "success", duration: 2500, isClosable: true });
    } catch (err) {
      const msg = err?.response?.data?.error || "Delete failed";
      toast({ title: msg, status: "error", duration: 3000, isClosable: true });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box bg={pageBg} minH="100vh" py={{ base: 10, md: 16 }}>
      <Container maxW="6xl">
        <Stack spacing={8}>
          <Heading size="2xl" color={textPrimary}>User Management</Heading>
          <Text color={textMuted}>Admins can view and edit user name, email, and role.</Text>

          <Box bg={cardBg} p={6} borderRadius="xl" borderWidth="1px" shadow="md" borderColor={borderColor}>
            <Stack direction={{ base: "column", md: "row" }} justify="space-between" mb={4}>
              <Heading size="md" color={textPrimary}>All Users</Heading>
              <Button size="sm" onClick={loadUsers} isLoading={loading} variant="outline">
                Refresh
              </Button>
            </Stack>

            <Table size="sm" variant="simple">
              <Thead bg={headerBg}>
                <Tr>
                  <Th borderColor={tableBorder}>ID</Th>
                  <Th borderColor={tableBorder}>Name</Th>
                  <Th borderColor={tableBorder}>Email</Th>
                  <Th borderColor={tableBorder}>Role</Th>
                  <Th borderColor={tableBorder}>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {(users || []).map((u) => (
                  <Tr key={u.id}>
                    <Td borderColor={tableBorder}>#{u.id}</Td>
                    <Td borderColor={tableBorder}>
                      <Input
                        size="sm"
                        value={u.name}
                        onChange={(e) => handleFieldChange(u.id, "name", e.target.value)}
                        bg={useColorModeValue("white", "#0b1f24")}
                      />
                    </Td>
                    <Td borderColor={tableBorder}>
                      <Input
                        size="sm"
                        type="email"
                        value={u.email}
                        onChange={(e) => handleFieldChange(u.id, "email", e.target.value)}
                        bg={useColorModeValue("white", "#0b1f24")}
                      />
                    </Td>
                    <Td borderColor={tableBorder}>
                      <Select
                        size="sm"
                        value={u.role}
                        onChange={(e) => handleFieldChange(u.id, "role", e.target.value)}
                        bg={useColorModeValue("white", "#0b1f24")}
                      >
                        <option value="volunteer">volunteer</option>
                        <option value="organization">organization</option>
                        <option value="admin">admin</option>
                      </Select>
                    </Td>
                    <Td borderColor={tableBorder}>
                      <Stack direction="row" spacing={2}>
                        <Button
                          size="sm"
                          colorScheme="teal"
                          onClick={() => updateUser(u)}
                          isLoading={savingId === u.id}
                          isDisabled={deletingId === u.id}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          variant="outline"
                          onClick={() => handleDelete(u.id)}
                          isLoading={deletingId === u.id}
                          isDisabled={savingId === u.id}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Td>
                  </Tr>
                ))}
                {(!users || users.length === 0) && (
                  <Tr>
                    <Td colSpan={5} borderColor={tableBorder}>
                      <Text color={textMuted}>No users found.</Text>
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
