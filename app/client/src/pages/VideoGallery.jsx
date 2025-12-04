import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  Link,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const toEmbedUrl = (url) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v") || parsed.pathname.split("/").pop();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
};

const VideoCard = ({ video }) => {
  const embed = useMemo(() => toEmbedUrl(video.video_url), [video.video_url]);
  const cardBg = useColorModeValue("#f8f6f2", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const subText = useColorModeValue("gray.500", "gray.400");
  const cardBorderColor = useColorModeValue("gray.200", "gray.700");
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} bg={cardBg} shadow="sm" borderColor={cardBorderColor}>
      <Stack spacing={2}>
        <Stack direction="row" align="center" justify="space-between">
          <Heading size="md">{video.title}</Heading>
          <Badge colorScheme={video.status === "approved" ? "green" : "yellow"}>
            {video.status}
          </Badge>
        </Stack>
        <Text color={textColor} noOfLines={2}>
          {video.description || "No description provided."}
        </Text>
        {embed ? (
          <Box
            as="iframe"
            src={embed}
            title={video.title}
            allowFullScreen
            width="100%"
            height="220px"
            border="0"
            borderRadius="md"
          />
        ) : (
          <Button
            as={Link}
            href={video.video_url}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            colorScheme="teal"
          >
            Open video
          </Button>
        )}
        <Text fontSize="sm" color={subText}>
          Submitted {new Date(video.created_at).toLocaleString()}
        </Text>
      </Stack>
    </Box>
  );
};

export default function VideoGallery() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const pageBg = useColorModeValue("#f2f0eb", "#08141a");
  const textColor = useColorModeValue("#1f262a", "gray.300");
  const cardBg = useColorModeValue("#f8f6f2", "var(--vh-ink-soft)");
  const cardBorder = useColorModeValue("rgba(26,165,154,0.25)", "rgba(15,108,95,0.45)");
  const emptyHeading = useColorModeValue("#1f262a", "var(--vh-ink-text)");
  const emptyMuted = useColorModeValue("#4a5561", "var(--vh-ink-muted)");

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/videos");
      setVideos(res.data?.videos || []);
    } catch (err) {
      console.error("Failed to load videos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <Box bg={pageBg} minH="100vh" py={{ base: 10, md: 16 }}>
      <Container maxW="6xl">
        <Stack spacing={4} mb={6}>
          <Heading size="2xl">Video Submissions</Heading>
          <Text fontSize="lg" color={textColor}>
            Watch approved volunteer stories and organization highlights. Submit your own to be featured.
          </Text>
          <Stack direction={{ base: "column", md: "row" }} spacing={3}>
            <Button
              as={RouterLink}
              to={user ? "/videos/submit" : "/login"}
              colorScheme="teal"
            >
              {user ? "Submit a video" : "Log in to submit a video"}
            </Button>
            <Button variant="ghost" onClick={fetchVideos}>
              Refresh
            </Button>
          </Stack>
        </Stack>

        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {[1, 2, 3, 4].map((n) => (
              <Skeleton key={n} height="260px" borderRadius="lg" />
            ))}
          </SimpleGrid>
        ) : videos.length === 0 ? (
          <Box
            bg={cardBg}
            color={emptyHeading}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={cardBorder}
            p={6}
            boxShadow="0 24px 60px rgba(0,0,0,0.35)"
          >
            <Heading size="md" mb={2} color={emptyHeading}>
              No videos yet
            </Heading>
            <Text color={emptyMuted}>
              Be the first to share your experience. Submit a video and we&apos;ll review it shortly.
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
}
