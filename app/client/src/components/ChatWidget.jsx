import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Badge as ChakraBadge,
  Text,
  Textarea,
  VStack,
  HStack,
  IconButton,
  Badge,
  Flex,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { api } from "../api/client";
import { opportunities as mockOpportunities } from "../mock/opportunities";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState("greeting");
  const [suggestedOpportunities, setSuggestedOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [botSinceOpen, setBotSinceOpen] = useState(0);
  const [greetingSent, setGreetingSent] = useState(false);
  const [followupSent, setFollowupSent] = useState(false);
  const messagesEndRef = useRef(null);
  const autoOpenTimerRef = useRef(null);
  const followupTimerRef = useRef(null);
  const navigate = useNavigate();

  const inkSurface = useColorModeValue("#f8f6f2", "var(--vh-ink-soft)");
  const inkAccent = useColorModeValue("#1aa59a", "#0f6c5f"); // darker for dark mode
  const inkText = useColorModeValue("#1f262a", "var(--vh-ink-text)");
  const inputBg = useColorModeValue("#ffffff", "#0b1f24");
  const bubbleUser = useColorModeValue("rgba(26,165,154,0.18)", "rgba(15,108,95,0.25)");
  const bubbleBot = useColorModeValue("rgba(26,165,154,0.1)", "rgba(15,108,95,0.16)");
  const borderSoft = useColorModeValue("rgba(26,165,154,0.25)", "rgba(15,108,95,0.45)");
  const headerBorder = useColorModeValue("rgba(26,165,154,0.2)", "rgba(15,108,95,0.25)");
  const placeholderColor = useColorModeValue("#5b6571", "rgba(231,247,244,0.5)");
  const focusShadow = useColorModeValue("rgba(26,165,154,0.6)", "rgba(15,108,95,0.6)");
  const buttonText = useColorModeValue("#0f252b", "#e7f7f4");
  const buttonHover = useColorModeValue("#1fb9ae", "#0f7c70");
  const descriptionColor = useColorModeValue("rgba(31,38,42,0.8)", "#e7f7f4"); // bright white/silver for dark mode

  const buttonActive = useColorModeValue("#169f92", "#0d685e");

  const normalizeText = (text = "") =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const levenshtein = (a, b) => {
    const m = a.length;
    const n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + cost // substitution
        );
      }
    }
    return dp[m][n];
  };

  const fuzzyIncludes = (needle, haystack) => {
    const n = normalizeText(needle);
    const h = normalizeText(haystack);
    if (!n) return true;
    if (h.includes(n)) return true;

    // allow small typos per word
    const words = h.split(" ");
    const tokens = n.split(" ");
    return tokens.every((token) =>
      words.some((word) => levenshtein(word, token) <= Math.max(1, Math.floor(token.length / 3)))
    );
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const hasUserMessage = messages.some((m) => m.role === "user");

  // Auto-open on first visit
  useEffect(() => {
    const seen = sessionStorage.getItem("vh_chat_seen");
    if (seen) return;
    autoOpenTimerRef.current = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem("vh_chat_seen", "true");
    }, 7000);
    return () => clearTimeout(autoOpenTimerRef.current);
  }, []);

  // Mark chat seen when user opens manually
  useEffect(() => {
    if (open) {
      sessionStorage.setItem("vh_chat_seen", "true");
      setUnreadCount(0);
      setBotSinceOpen(0);
    }
  }, [open]);

  // Initialize greeting when chat opens first time
  useEffect(() => {
    if (open && !greetingSent) {
      addBotMessage(
        "Hi! I'm here to help you find volunteer opportunities. What kind of work interests you? (e.g., 'remote grant writing' or 'beach cleanup in Boca Raton')"
      );
      setGreetingSent(true);
    }
  }, [open, greetingSent]);

  // Schedule a single follow-up after 30s if no user reply yet
  useEffect(() => {
    if (!greetingSent || followupSent || hasUserMessage) {
      if (followupTimerRef.current) {
        clearTimeout(followupTimerRef.current);
        followupTimerRef.current = null;
      }
      return;
    }
    followupTimerRef.current = setTimeout(() => {
      if (!hasUserMessage) {
        addBotMessage("Need ideas? Tell me your city or say 'remote' and what you’d like to do, and I’ll suggest matches.");
        setFollowupSent(true);
      }
    }, 30000);

    return () => {
      if (followupTimerRef.current) {
        clearTimeout(followupTimerRef.current);
        followupTimerRef.current = null;
      }
    };
  }, [greetingSent, followupSent, hasUserMessage]);

  // Track unread when closed and bot messages arrive
  useEffect(() => {
    if (!open && messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.role === "bot") {
        setUnreadCount((prev) => Math.max(prev, 1));
      }
    }
  }, [messages, open]);

  const addBotMessage = (content, opportunities = null) => {
    setMessages((prev) => [
      ...prev,
      { role: "bot", content, opportunities, timestamp: new Date() },
    ]);
    setBotSinceOpen((prev) => prev + 1);
  };

  const addUserMessage = (content) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content, timestamp: new Date() },
    ]);
    setUnreadCount(0);
  };

  const extractPreferences = (text) => {
    const lowerText = text.toLowerCase();
    
    // Extract location keywords
    const locationMatch = lowerText.match(/in\s+([a-z\s]+?)(?:\s|$|,|\.|!|\?)/i);
    const location = locationMatch ? locationMatch[1].trim() : null;

    // Extract interest keywords (simple approach)
    const keywords = lowerText
      .replace(/in\s+[a-z\s]+/i, "") // Remove location part
      .replace(/[^\w\s]/g, "") // Remove punctuation
      .trim();

    return { location, keywords };
  };

  const fetchOpportunities = async (prefs) => {
    setLoading(true);
    try {
      const matchesLocation = (opp) => {
        if (!prefs.location) return true;
        return (
          fuzzyIncludes(prefs.location, opp.location || "") ||
          fuzzyIncludes(opp.location || "", prefs.location)
        );
      };

      const matchesKeywords = (opp) => {
        if (!prefs.keywords) return true;
        return (
          fuzzyIncludes(prefs.keywords, opp.title || "") ||
          fuzzyIncludes(prefs.keywords, opp.description || "") ||
          fuzzyIncludes(prefs.keywords, opp.tags?.join(" ") || "")
        );
      };

      const applyFilters = (list) => list.filter((opp) => matchesLocation(opp) && matchesKeywords(opp));

      const attemptFetch = async (useLocation = true) => {
        const params = {};
        if (useLocation && prefs.location) {
          params.location = prefs.location;
        }
        const response = await api.get("/opportunities", { params });
        return response.data.opportunities || [];
      };

      // 1) Try with location (if provided)
      let opportunities = applyFilters(await attemptFetch(true));

      // 2) If nothing found and we searched by location, retry without location
      if (opportunities.length === 0 && prefs.location) {
        opportunities = applyFilters(await attemptFetch(false));
      }

      // 3) If still nothing, last resort fetch all then filter
      if (opportunities.length === 0) {
        opportunities = applyFilters(await attemptFetch(false));
      }

      // 4) Fallback to mock data if API yields nothing
      if (opportunities.length === 0) {
        opportunities = applyFilters(mockOpportunities);
      }

      return opportunities.slice(0, 3); // Return top 3
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      const fallback = mockOpportunities
        .filter((opp) => {
          const matchesKeyword =
            !prefs.keywords ||
            fuzzyIncludes(prefs.keywords, opp.title || "") ||
            fuzzyIncludes(prefs.keywords, opp.description || "") ||
            fuzzyIncludes(prefs.keywords, opp.tags?.join(" ") || "");
          const matchesLocation =
            !prefs.location ||
            fuzzyIncludes(prefs.location, opp.location || "") ||
            fuzzyIncludes(opp.location || "", prefs.location);
          return matchesKeyword && matchesLocation;
        })
        .slice(0, 3);
      return fallback;
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    addUserMessage(userMessage);
    setMessage("");

    const lowerMessage = userMessage.toLowerCase();

    // Handle "saved opportunities" query
    if (lowerMessage.includes("saved") || lowerMessage.includes("save")) {
      const saved = JSON.parse(localStorage.getItem("vh_saved_opportunities") || "[]");
      if (saved.length > 0) {
        addBotMessage(
          `You have ${saved.length} saved opportunit${saved.length === 1 ? "y" : "ies"}:`,
          saved
        );
        addBotMessage("Would you like to apply to any of these? Just click on one!");
      } else {
        addBotMessage("You don't have any saved opportunities yet. Let me help you find some!");
        setStep("collecting_preferences");
      }
      return;
    }

    // Handle help/restart
    if (lowerMessage.includes("help") || lowerMessage.includes("start over")) {
      setStep("greeting");
      setSuggestedOpportunities([]);
      addBotMessage(
        "No problem! What kind of volunteer work are you interested in? You can mention the type of work and location."
      );
      return;
    }

    // Main conversation flow
    if (step === "greeting" || step === "collecting_preferences") {
      const prefs = extractPreferences(userMessage);

      if (!prefs.keywords && !prefs.location) {
        addBotMessage(
          "I'd love to help! Could you tell me more about what you're looking for? For example: 'food bank work' or 'environmental projects in Seattle'"
        );
        setStep("collecting_preferences");
        return;
      }

      addBotMessage("Great! Let me find some opportunities for you...");
      const opportunities = await fetchOpportunities(prefs);

      if (opportunities.length === 0) {
        addBotMessage(
          "I couldn't find any opportunities matching those criteria. Try different keywords or location, or type 'help' to start over."
        );
        setStep("collecting_preferences");
      } else {
        setSuggestedOpportunities(opportunities);
        addBotMessage(
          `I found ${opportunities.length} opportunit${opportunities.length === 1 ? "y" : "ies"} for you:`,
          opportunities
        );
        addBotMessage(
          "Click on any opportunity to view details and apply, or type 'save these' to save them for later!"
        );
        setStep("showing_suggestions");
      }
    } else if (step === "showing_suggestions") {
      if (lowerMessage.includes("save")) {
        // Save to localStorage
        const existing = JSON.parse(localStorage.getItem("vh_saved_opportunities") || "[]");
        const newSaved = [...existing];
        
        suggestedOpportunities.forEach((opp) => {
          if (!newSaved.find((s) => s.id === opp.id)) {
            newSaved.push(opp);
          }
        });
        
        localStorage.setItem("vh_saved_opportunities", JSON.stringify(newSaved));
        addBotMessage(
          `Saved ${suggestedOpportunities.length} opportunit${suggestedOpportunities.length === 1 ? "y" : "ies"}! Type 'show saved' anytime to see them.`
        );
        addBotMessage("Is there anything else I can help you with?");
        setStep("greeting");
      } else {
        addBotMessage(
          "You can click on any opportunity card above to view details, or type 'save these' to save them for later. Need help? Just ask!"
        );
      }
    }
  };

  const handleOpportunityClick = (oppId) => {
    navigate(`/opportunities/${oppId}`);
    setOpen(false);
  };

  const handleCloseChat = () => {
    setOpen(false);
    if (!hasUserMessage) {
      setUnreadCount((prev) => {
        // Show a single reminder only if there were bot messages since open; otherwise clear.
        return botSinceOpen > 0 ? 1 : 0;
      });
    } else {
      setUnreadCount(0);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box position="fixed" bottom={{ base: 3, md: 6 }} right={{ base: 3, md: 6 }} zIndex={1200}>
      {open ? (
        <Box
          w={{ base: "90vw", sm: "380px" }}
          maxH={{ base: "80vh", md: "600px" }}
          bg={inkSurface}
          color={inkText}
          borderRadius="lg"
          boxShadow="0 20px 50px rgba(0,0,0,0.28)"
          border={`1px solid ${borderSoft}`}
          display="flex"
          flexDirection="column"
        >
          {/* Header */}
          <HStack
            justify="space-between"
            p={4}
            borderBottom={`1px solid ${headerBorder}`}
          >
            <Text fontWeight="700">VolunteerHub Chat</Text>
            <IconButton
              size="sm"
              aria-label="Close chat"
              icon={<CloseIcon boxSize={3} />}
              variant="ghost"
              color={inkText}
              onClick={handleCloseChat}
            />
          </HStack>

          {/* Messages */}
          <VStack
            align="stretch"
            spacing={3}
            p={4}
            flex="1"
            overflowY="auto"
            maxH={{ base: "50vh", md: "400px" }}
          >
            {messages.map((msg, idx) => (
              <Box key={idx}>
                <Flex justify={msg.role === "user" ? "flex-end" : "flex-start"}>
                  <Box
                    bg={msg.role === "user" ? bubbleUser : bubbleBot}
                    borderRadius="md"
                    p={3}
                    maxW="85%"
                    fontSize="sm"
                  >
                    <Text>{msg.content}</Text>
                  </Box>
                </Flex>

                {/* Opportunity cards */}
                {msg.opportunities && msg.opportunities.length > 0 && (
                  <VStack align="stretch" spacing={2} mt={2}>
                    {msg.opportunities.map((opp) => (
                      <Box
                        key={opp.id}
                        bg={inputBg}
                        borderRadius="md"
                        p={3}
                        border={`1px solid ${borderSoft}`}
                        cursor="pointer"
                        _hover={{
                          borderColor: inkAccent,
                          transform: "translateY(-2px)",
                          transition: "all 0.2s",
                        }}
                        onClick={() => handleOpportunityClick(opp.id)}
                      >
                        <Text fontWeight="600" fontSize="sm" mb={1}>
                          {opp.title}
                        </Text>
                        {opp.location && (
                          <Badge colorScheme="teal" fontSize="xs" mb={2}>
                            {opp.location}
                          </Badge>
                        )}
                        <Text fontSize="xs" noOfLines={2} color={descriptionColor}>
                          {opp.description || "No description available"}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                )}
              </Box>
            ))}

            {loading && (
              <Flex justify="center" py={2}>
                <Spinner size="sm" color={inkAccent} />
              </Flex>
            )}

            <div ref={messagesEndRef} />
          </VStack>

          {/* Input */}
          <Box p={4} borderTop="1px solid rgba(24,178,165,0.2)">
            <VStack spacing={2}>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                minH="60px"
                maxH="120px"
                fontSize="sm"
                bg={inputBg}
                color={inkText}
                borderColor={borderSoft}
                _placeholder={{ color: placeholderColor }}
                _focus={{
                  borderColor: inkAccent,
                  boxShadow: `0 0 0 1px ${focusShadow}`,
                }}
              />
              <Button
                w="100%"
                bg={inkAccent}
                color={buttonText}
                _hover={{ bg: buttonHover }}
                _active={{ bg: buttonActive }}
                onClick={handleSendMessage}
                isDisabled={!message.trim() || loading}
              >
                Send message
              </Button>
            </VStack>
          </Box>
        </Box>
      ) : (
        <Button
          bg={inkAccent}
          color={buttonText}
          _hover={{ bg: buttonHover }}
          borderRadius="full"
          px={5}
          py={6}
          boxShadow="0 12px 30px rgba(24,178,165,0.38)"
          onClick={() => setOpen(true)}
          >
          {unreadCount > 0 && (
            <ChakraBadge
              colorScheme="red"
              borderRadius="full"
              px={2}
              py={1}
              fontSize="sm"
              position="absolute"
              top="-10px"
              left="-12px"
              boxShadow="0 6px 18px rgba(0,0,0,0.35)"
            >
              {unreadCount}
            </ChakraBadge>
          )}
          Chat with us
        </Button>
      )}
    </Box>
  );
}
