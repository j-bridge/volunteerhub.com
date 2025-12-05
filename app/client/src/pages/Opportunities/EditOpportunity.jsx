import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useColorModeValue,
  HStack,
  Spacer,
  IconButton,
  RadioGroup,
  Radio,
  Stack as ChakraStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/client";
import { CloseIcon } from "@chakra-ui/icons";
import useAppToast from "../../hooks/useAppToast";

export default function EditOpportunity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useAppToast();
  const { user, updateCreatedOpportunity } = useAuth();
  const pageBg = useColorModeValue("#f2f0eb", "#08141a");
  const cardBg = useColorModeValue("white", "var(--vh-ink-soft)");
  const textPrimary = useColorModeValue("#1f262a", "var(--vh-ink-text)");
  const textMuted = useColorModeValue("#4a5561", "rgba(231,247,244,0.78)");
  const borderColor = useColorModeValue("rgba(26,165,154,0.28)", "rgba(26,165,154,0.45)");

  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Community");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Open");
  const [saving, setSaving] = useState(false);
  const [closing, setClosing] = useState(false);

  const created = user?.createdOpportunities || [];
  const existing = created.find((o) => String(o.id) === String(id));

  const normalizeDateInput = (value) => {
    if (!value) return "";
    if (value.length === 10 && value.includes("-")) return value;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
  };

  const isNumericId = /^\d+$/.test(String(id || ""));

  const hydrateFrom = (source) => {
    if (!source) return;
    const orgName =
      typeof source.organization === "string"
        ? source.organization
        : source.organization?.name;
    setTitle(source.title || "");
    setOrganization(orgName || source.organization_name || "");
    setDate(normalizeDateInput(source.date || source.start_date) || "");
    setLocation(source.location || "");
    setCategory(source.category || "Community");
    setDescription(source.description || "");
    setStatus(source.status === "Draft" || source.is_active === false ? "Draft" : "Open");
  };

  useEffect(() => {
    if (existing) {
      hydrateFrom(existing);
      setLoaded(true);
    }
  }, [existing]);

  useEffect(() => {
    const loadFromApi = async () => {
      if (!isNumericId) {
        setLoadError("This opportunity has not synced to the server yet. Please refresh once it finishes saving.");
        setLoaded(true);
        return;
      }
      try {
        const res = await api.get(`/opportunities/${id}`);
        const opp = res.data?.opportunity;
        if (opp) {
          hydrateFrom({
            ...opp,
            organization_name: opp.organization?.name,
            date: opp.start_date,
          });
        }
      } catch (err) {
        setLoadError("Could not load opportunity.");
      } finally {
        setLoaded(true);
      }
    };
    loadFromApi();
  }, [id]);

  const saveDraftAndExit = async () => {
    setClosing(true);
    try {
      await api.patch(`/opportunities/${id}`, {
        is_active: false,
      });
      updateCreatedOpportunity(id, {
        status: "Draft",
        is_active: false,
      });
      toast({
        title: "Saved as draft",
        status: "info",
        duration: 6000,
        isClosable: true,
      });
      navigate("/org/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.error || "Could not save draft";
      toast({
        title: msg,
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    } finally {
      setClosing(false);
    }
  };

  const handleExitWithoutSave = () => {
    navigate(-1);
  };

  const handleCancel = async () => {
    const confirmSave = window.confirm(
      "Save this opportunity as a draft before exiting?\nOK = Save as draft, Cancel = Exit without saving."
    );
    if (confirmSave) {
      await saveDraftAndExit();
    } else {
      handleExitWithoutSave();
    }
  };

  if (!loaded) {
    // small loading state
    return (
      <Box py={16} bg={pageBg} minH="calc(100vh - 160px)">
        <Container maxW="container.md">
          <Text color={textMuted}>Loading opportunity...</Text>
        </Container>
      </Box>
    );
  }

  if (!existing && loadError) {
    // no such opp in this org's local state
    return (
      <Box py={16} bg={pageBg} minH="calc(100vh - 160px)">
        <Container maxW="container.md">
          <Heading mb={3} color={textPrimary}>Opportunity not found</Heading>
          <Text mb={6} color={textMuted}>
            {loadError}
          </Text>
          <Button onClick={() => navigate("/org/dashboard")} colorScheme="teal">
            Back to dashboard
          </Button>
        </Container>
      </Box>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !organization || !date || !location || !description) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        status: "warning",
        duration: 6000,
        isClosable: true,
      });
      return;
    }

    setSaving(true);
    try {
      await api.patch(`/opportunities/${id}`, {
        title,
        description,
        location,
        start_date: new Date(date).toISOString(),
        is_active: status === "Open",
        org_id: user?.organization_id,
      });

      updateCreatedOpportunity(id, {
        title,
        organization,
        date,
        location,
        category,
        description,
        status,
        is_active: status === "Open",
      });

      toast({
        title: "Opportunity updated",
        description: "Changes saved.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/org/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.error || "Could not update opportunity";
      toast({
        title: msg,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const disableAll = saving || closing;

  return (
    <Box py={16} bg={pageBg} minH="calc(100vh - 160px)">
      <Container maxW="container.md">
        <HStack mb={2} align="center">
          <Heading color={textPrimary}>Edit Opportunity</Heading>
          <Spacer />
          <IconButton
            aria-label="Close"
            icon={<CloseIcon />}
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            isDisabled={disableAll}
          />
        </HStack>
        <Text mb={8} color={textMuted}>
          Update the details of your volunteer event. This uses the same fields
          as the create form.
        </Text>

        <Box
          as="form"
          onSubmit={handleSubmit}
          bg={cardBg}
          borderWidth="1px"
          borderRadius="lg"
          p={6}
          boxShadow="sm"
          borderColor={borderColor}
        >
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="e.g. Community Food Drive"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Organization</FormLabel>
              <Input
                placeholder="e.g. Helping Hands Foundation"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Location</FormLabel>
              <Input
                placeholder="e.g. Boca Raton, FL"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Category</FormLabel>
              <Input
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Describe the event, responsibilities, and who you're hoping to reach."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Status</FormLabel>
              <RadioGroup
                onChange={(val) => setStatus(val)}
                value={status}
              >
                <ChakraStack direction="row" spacing={6}>
                  <Radio value="Open">Open</Radio>
                  <Radio value="Draft">Draft</Radio>
                </ChakraStack>
              </RadioGroup>
            </FormControl>

            <HStack spacing={4}>
              <Button
                type="submit"
                colorScheme="teal"
                mt={2}
                alignSelf="flex-start"
                isLoading={saving}
                isDisabled={disableAll}
              >
                Save Changes
              </Button>
              <Button
                variant="ghost"
                mt={2}
                alignSelf="flex-start"
                onClick={handleCancel}
                isDisabled={disableAll}
              >
                Cancel
              </Button>
            </HStack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
