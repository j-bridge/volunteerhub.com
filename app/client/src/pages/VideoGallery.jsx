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

const toEmbedUrl = (url, { autoplay = false } = {}) => {
  try {
    const cleanUrl = (url || "").trim();
    if (!cleanUrl) return null;
    const parsed = new URL(cleanUrl);
    const host = parsed.hostname;

    if (host.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      if (!id) return null;
      const query = new URLSearchParams();
      query.set("controls", "1");
      query.set("rel", "0");
      if (autoplay) {
        query.set("autoplay", "1");
        query.set("mute", "1");
      }
      return `https://www.youtube.com/embed/${id}?${query.toString()}`;
    }

    if (host.includes("youtube.com")) {
      const id = parsed.searchParams.get("v") || parsed.pathname.split("/").pop();
      if (!id) return null;
      const query = new URLSearchParams();
      query.set("controls", "1");
      query.set("rel", "0");
      if (autoplay) {
        query.set("autoplay", "1");
        query.set("mute", "1");
      }
      return `https://www.youtube.com/embed/${id}?${query.toString()}`;
    }

    if (host.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      if (!id) return null;
      const query = new URLSearchParams();
      query.set("controls", "1");
      if (autoplay) {
        query.set("autoplay", "1");
        query.set("muted", "1");
      }
      return `https://player.vimeo.com/video/${id}?${query.toString()}`;
    }
  } catch {
    return null;
  }
  return null;
};

const VideoCard = ({ video, hideTimestamp = false, expanded = false, onToggleExpand }) => {
  const embed = useMemo(() => toEmbedUrl(video.video_url, { autoplay: true }), [video.video_url]);
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
        <Text color={textColor} noOfLines={expanded ? undefined : 2}>
          {video.description || "No description provided."}
        </Text>
        {video.description && video.description.length > 120 && (
          <Button onClick={onToggleExpand} size="xs" variant="link" colorScheme="teal" alignSelf="flex-start">
            {expanded ? "Show less" : "Show more"}
          </Button>
        )}
        {embed ? (
          <Box
            as="iframe"
            src={embed}
            title={video.title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            width="100%"
            height="220px"
            border="0"
            borderRadius="md"
          />
        ) : (
          <Box
            as="video"
            src={video.video_url}
            width="100%"
            height="auto"
            borderRadius="md"
            controls
            autoPlay
            muted
            playsInline
            style={{ backgroundColor: "#000" }}
          />
        )}
      </Stack>
    </Box>
  );
};

const FeaturedVideo = ({ video, embedUrl, expanded, onToggleExpand }) => {
  const cardBg = useColorModeValue("#ffffff", "var(--vh-ink-soft)");
  const borderColor = useColorModeValue("rgba(26,165,154,0.25)", "rgba(26,165,154,0.45)");
  const textColor = useColorModeValue("#1f262a", "gray.100");
  const muted = useColorModeValue("gray.600", "rgba(231,247,244,0.8)");

  return (
    <Box
      bg={cardBg}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={borderColor}
      p={{ base: 4, md: 6 }}
      mb={8}
      boxShadow="0 20px 50px rgba(0,0,0,0.18)"
    >
      <Stack spacing={4}>
        <Stack direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "flex-start", md: "center" }}>
          <Heading size="lg" color={textColor}>
            Featured Project
          </Heading>
          <Badge colorScheme="green" variant="solid">
            {video.status}
          </Badge>
        </Stack>
        <Text color={muted} noOfLines={expanded ? undefined : 3}>
          {video.description || "No description provided."}
        </Text>
        {video.description && video.description.length > 160 && (
          <Button onClick={onToggleExpand} size="sm" variant="link" colorScheme="teal" alignSelf="flex-start">
            {expanded ? "Show less" : "Read full description"}
          </Button>
        )}
        {embedUrl ? (
          <Box
            as="iframe"
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            width="100%"
            height="420px"
            border="0"
            borderRadius="lg"
          />
        ) : (
          <Box
            as="video"
            src={video.video_url}
            width="100%"
            height="auto"
            borderRadius="lg"
            controls
            autoPlay
            muted
            playsInline
            style={{ backgroundColor: "#000" }}
          />
        )}
      </Stack>
    </Box>
  );
};

export default function VideoGallery() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState({});
  const [featuredExpanded, setFeaturedExpanded] = useState(false);
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

  const approvedVideos = videos.filter((v) => v.status === "approved");
  const featuredVideo = approvedVideos[0] || null;
  const featuredEmbedUrl = featuredVideo ? toEmbedUrl(featuredVideo.video_url, { autoplay: true }) : null;
  const showFeatured = Boolean(featuredVideo);
  const remainingVideos = showFeatured ? videos.filter((v) => v.id !== featuredVideo.id) : videos;

  return (
    <Box bg={pageBg} minH="100vh" py={{ base: 10, md: 16 }}>
      <Container maxW="6xl">
        <Stack spacing={4} mb={6}>
          <Heading size="2xl">Project Submission</Heading>
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

        {showFeatured && featuredVideo && (
          <>
            <FeaturedVideo
              video={featuredVideo}
              embedUrl={featuredEmbedUrl}
              expanded={featuredExpanded}
              onToggleExpand={() => setFeaturedExpanded((v) => !v)}
            />
            <Box
              bg={cardBg}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={cardBorder}
              p={4}
              shadow="sm"
              mb={6}
            >
              <Heading size="sm" mb={2} color={textColor}>
                GitHub repository for this site
              </Heading>
              <Link
                href="https://github.com/j-bridge/volunteerhub.com.git"
                target="_blank"
                rel="noopener noreferrer"
                color="teal.500"
                fontWeight="600"
              >
                https://github.com/j-bridge/volunteerhub.com.git
              </Link>
            </Box>
          </>
        )}

        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {[1, 2, 3, 4].map((n) => (
              <Skeleton key={n} height="260px" borderRadius="lg" />
            ))}
          </SimpleGrid>
        ) : remainingVideos.length === 0 ? (
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
            {remainingVideos.map((video, idx) => {
              const hideTimestamp = !featuredVideo && idx === 0;
              return (
                <Stack key={video.id} spacing={3}>
                  <VideoCard
                    video={video}
                    hideTimestamp={hideTimestamp}
                    expanded={!!expandedIds[video.id]}
                    onToggleExpand={() =>
                      setExpandedIds((cur) => ({ ...cur, [video.id]: !cur[video.id] }))
                    }
                  />
                  {!featuredVideo && idx === 0 && (
                    <Box
                      bg={cardBg}
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor={cardBorder}
                      p={4}
                      shadow="sm"
                    >
                      <Heading size="sm" mb={2} color={textColor}>
                        GitHub repository for this site
                      </Heading>
                      <Link
                        href="https://github.com/j-bridge/volunteerhub.com.git"
                        target="_blank"
                        rel="noopener noreferrer"
                        color="teal.500"
                        fontWeight="600"
                      >
                        https://github.com/j-bridge/volunteerhub.com.git
                      </Link>
                    </Box>
                  )}
                </Stack>
              );
            })}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
}
