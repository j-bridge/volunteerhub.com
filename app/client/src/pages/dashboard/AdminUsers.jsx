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

  return (
    <Box bg="gray.50" minH="100vh" py={{ base: 10, md: 16 }}>
      <Container maxW="6xl">
        <Stack spacing={8}>
          <Heading size="2xl">User Management</Heading>
          <Text color="gray.600">Admins can view and edit user name, email, and role.</Text>

          <Box bg="white" p={6} borderRadius="xl" borderWidth="1px" shadow="md">
            <Stack direction={{ base: "column", md: "row" }} justify="space-between" mb={4}>
              <Heading size="md">All Users</Heading>
              <Button size="sm" onClick={loadUsers} isLoading={loading} variant="outline">
                Refresh
              </Button>
            </Stack>

            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {(users || []).map((u) => (
                  <Tr key={u.id}>
                    <Td>#{u.id}</Td>
                    <Td>
                      <Input
                        size="sm"
                        value={u.name}
                        onChange={(e) => handleFieldChange(u.id, "name", e.target.value)}
                      />
                    </Td>
                    <Td>
                      <Input
                        size="sm"
                        type="email"
                        value={u.email}
                        onChange={(e) => handleFieldChange(u.id, "email", e.target.value)}
                      />
                    </Td>
                    <Td>
                      <Select
                        size="sm"
                        value={u.role}
                        onChange={(e) => handleFieldChange(u.id, "role", e.target.value)}
                      >
                        <option value="volunteer">volunteer</option>
                        <option value="organization">organization</option>
                        <option value="admin">admin</option>
                      </Select>
                    </Td>
                    <Td>
                      <Button
                        size="sm"
                        colorScheme="teal"
                        onClick={() => updateUser(u)}
                        isLoading={savingId === u.id}
                      >
                        Save
                      </Button>
                    </Td>
                  </Tr>
                ))}
                {(!users || users.length === 0) && (
                  <Tr>
                    <Td colSpan={5}>
                      <Text color="gray.600">No users found.</Text>
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
