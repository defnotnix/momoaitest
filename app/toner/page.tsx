"use client";

import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Container,
  Group,
  Paper,
  ScrollArea,
  Text,
  TextInput,
} from "@mantine/core";
import { ChatIcon, PaperPlaneRightIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import axios from "axios";
import { randomId } from "@mantine/hooks";

import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";

export default function PageToner() {
  const Router = useRouter();

  const [sessionId, setSessionId] = useState(randomId());
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "bot"; message: string }[]
  >([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Push user's message
    setChatHistory((prev) => [...prev, { role: "user", message: trimmed }]);
    setInput("");

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5678/webhook/tonizer".replace(
          "localhost",
          "192.168.101.200"
        ),
        {
          sessionId: sessionId,
          chatInput: trimmed,
        }
      );

      setLoading(false);
console.log(res)
      // Access actual response data
      const reply = res.data?.output || "⚠️ Empty response from server.";

      setChatHistory((prev) => [...prev, { role: "bot", message: reply }]);
    } catch (error) {
      setLoading(false);
      setChatHistory((prev) => [
        ...prev,
        { role: "bot", message: "⚠️ Failed to connect to server." },
      ]);
    }
  };

  const refreshChat = () => {
    setChatHistory([]);
    setInput("");
    setSessionId(randomId()); // 🔄 Generate new session ID
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <section
      style={{
        height: "100vh",
        background:
          "linear-gradient(to bottom, var(--mantine-color-dark-9), var(--mantine-color-indigo-9))",
      }}
    >
      <Container size="xs" px="xs" pt={16}>
        <Paper
          pos="relative"
          radius="xl"
          withBorder
          style={{ height: "95vh", display: "flex", flexDirection: "column" }}
        >
          {/* Chat Messages */}
          <ScrollArea
            h="100%"
            offsetScrollbars
            scrollbarSize={6}
            style={{ flex: 1 }}
            viewportRef={scrollRef}
          >
            <Box px="md" pt="md" pb={80}>
              <Box
                mb="sm"
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <Paper radius="lg" py="sm" px="lg" bg={"gray.2"} maw="80%">
                  <Text size="sm">
                    Type message to tone-ize based on momo's tone.
                  </Text>
                </Paper>
              </Box>

              {chatHistory.map((msg, idx) => (
                <Box
                  key={idx}
                  mb="sm"
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <Paper
                    radius="lg"
                    px="lg"
                    bg={msg.role === "user" ? "indigo.6" : "gray.2"}
                    c={msg.role === "user" ? "white" : "black"}
                    maw="80%"
                  >
                    <Box style={{ fontSize: "var(--mantine-font-size-sm)" }}>
                      <ReactMarkdown>{msg.message}</ReactMarkdown>
                    </Box>
                  </Paper>
                </Box>
              ))}

              {loading && (
                <Box
                  mb="sm"
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <Paper radius="lg" py="sm" px="lg" bg={"gray.2"} maw="80%">
                    <Text size="sm">Typing ...</Text>
                  </Paper>
                </Box>
              )}
            </Box>
          </ScrollArea>

          <Box p="sm">
            <TextInput
              radius="lg"
              size="xl"
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              onKeyDown={handleKeyPress}
              rightSection={
                <ActionIcon
                  size="lg"
                  color="indigo"
                  radius="lg"
                  onClick={handleSend}
                >
                  <PaperPlaneRightIcon />
                </ActionIcon>
              }
              placeholder="Type your message..."
              styles={{
                input: {
                  fontSize: "var(--mantine-font-size-sm)",
                },
              }}
            />
          </Box>

          <ActionIcon
            pos="absolute"
            right={-54}
            bottom={26}
            size="lg"
            color="teal"
            radius="lg"
            variant="filled"
            onClick={refreshChat}
            title="Clear chat and reset session"
          >
            ↻
          </ActionIcon>

          <Button
            size="xs"
            pos="absolute"
            left={-120}
            bottom={26}
            color="dark"
            radius="lg"
            variant="filled"
            onClick={() => {
              Router.push("/");
            }}
            title="Clear chat and reset session"
            leftSection={<ChatIcon size={12} />}
          >
            To Chat
          </Button>
        </Paper>
      </Container>
    </section>
  );
}
