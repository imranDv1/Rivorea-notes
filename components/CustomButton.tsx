"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import { Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const AI_AVATAR = "/icons/note ai.png";
const PLACEHOLDER_AVATAR =
  "https://api.dicebear.com/7.x/lorelei/svg?seed=user&backgroundColor=transparent";

const CustomButton = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const userName = user?.name || "You";
  const userImage = user?.image || PLACEHOLDER_AVATAR;

  const [title, setTitle] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "ai",
      name: "NoteBuddy",
      avatar: AI_AVATAR,
      text: "Hello! How can I help you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = async () => {
    if (!title.trim() || loading) return;

    const userMsg = {
      from: "user",
      name: userName,
      avatar: userImage,
      text: title,
    };
    setMessages((prev) => [...prev, userMsg]);
    setTitle("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, title }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message)
           setMessages((prev) => [
        ...prev,
        {
          from: "ai",
          name: "NoteBuddy",
          avatar: AI_AVATAR,
          text: `${data.message}`,
        },
      ]);
      }
      if (!data.body) throw new Error("AI response invalid");

      setMessages((prev) => [
        ...prev,
        {
          from: "ai",
          name: "NoteBuddy",
          avatar: AI_AVATAR,
          text: data.body.trim(),
        },
      ]);
    } catch (err) {
     
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) handleSubmit();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(
      text.replace(/\n{3,}/g, "\n\n").replace(/\t/g, "  ")
    );
    toast.success("Copied to notes ✅");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="hover:cursor-pointer group relative dark:bg-neutral-800 bg-neutral-200 p-px overflow-hidden rounded-xl">
          {/* 🌟 Fancy background */}
          <span className="absolute inset-0 overflow-hidden">
            <span className="inset-0 absolute pointer-events-none select-none">
              <span
                className="block -translate-x-1/2 -translate-y-1/3 size-24 blur-xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))",
                }}
              />
            </span>
          </span>

          <span
            className="inset-0 absolute pointer-events-none select-none"
            style={{
              animation:
                "10s ease-in-out infinite alternate border-glow-translate",
            }}
          >
            <span
              className="block z-0 h-full w-12 blur-xl -translate-x-1/2"
              style={{
                animation:
                  "10s ease-in-out infinite alternate border-glow-scale",
                background:
                  "linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))",
              }}
            />
          </span>

          {/* Button inner content */}
          <span className="flex items-center justify-center gap-1 relative z-[1] dark:bg-neutral-950/90 bg-neutral-50/90 py-2 px-4 pl-2 w-full rounded-xl">
            <span className="relative group-hover:scale-105 transition-transform group-hover:rotate-[360deg] duration-500">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-80 dark:opacity-100"
              >
                <path
                  d="M11.5 2.3c.05-.1.12-.2.2-.25.08-.05.18-.08.28-.08s.2.03.28.08c.08.05.15.15.2.25l2.3 4.7c.15.3.38.57.66.77.28.2.61.34.96.38l5.2.76c.1.02.2.07.27.13.07.06.13.15.16.24.03.09.04.2.01.29a.55.55 0 0 1-.18.27l-3.74 3.64c-.25.24-.43.53-.52.85-.1.32-.12.66-.06.99l.88 5.14c.02.1.01.21-.03.31-.04.1-.1.18-.19.25a.52.52 0 0 1-.33.1c-.1 0-.2-.02-.29-.07l-4.6-2.42a2.3 2.3 0 0 0-2.33 0l-4.6 2.42c-.09.05-.19.07-.29.07a.52.52 0 0 1-.33-.1c-.09-.07-.15-.16-.19-.25-.04-.1-.05-.21-.03-.31l.88-5.14c.06-.33.03-.67-.06-.99a2.3 2.3 0 0 0-.52-.85L2 9.8a.55.55 0 0 1-.18-.27.58.58 0 0 1 .01-.29c.03-.09.09-.18.16-.24.07-.06.17-.11.27-.13l5.2-.76c.35-.05.68-.18.96-.38.28-.2.51-.47.66-.77l2.3-4.7Z"
                  fill="url(#grad)"
                  stroke="url(#grad)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="grad"
                    x1="0"
                    y1="0"
                    x2="24"
                    y2="24"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#7A69F9" />
                    <stop offset="0.5" stopColor="#F26378" />
                    <stop offset="1" stopColor="#F5833F" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="ml-1.5 text-xs bg-gradient-to-b dark:from-white dark:to-white/50 from-neutral-950 to-neutral-950/50 bg-clip-text text-transparent group-hover:scale-105 transition transform-gpu">
              AI
            </span>
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-2xl outline-0 min-h-[550px] p-6 rounded-2xl shadow-2xl bg-white dark:bg-neutral-900">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Image
              src={AI_AVATAR}
              alt="AI"
              width={40}
              height={40}
              className="rounded-full"
            />
            Chat with NoteBuddy
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[450px] mt-6 gap-4">
          <div className="flex-1 overflow-y-auto flex flex-col gap-7 px-2">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: msg.from === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-3 ${
                    msg.from === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <Image
                    src={msg.avatar}
                    alt={msg.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-1 max-w-[70%]">
                    <span
                      className={`font-semibold text-sm ${
                        msg.from === "user" ? "text-right" : ""
                      }`}
                    >
                      {msg.name}
                    </span>
                    <div className="relative group">
                      <span
                        className={`block px-4 py-2 text-sm rounded-2xl break-words ${
                          msg.from === "ai"
                            ? "bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-700 text-neutral-900 dark:text-neutral-100"
                            : "bg-primary text-white"
                        }`}
                      >
                        {msg.text}
                      </span>
                      {msg.from === "ai" && (
                        <button
                          onClick={() => copyToClipboard(msg.text)}
                          className="absolute -bottom-5 right-0 text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
                        >
                          <Copy size={12} /> Copy
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <Image
                  src={AI_AVATAR}
                  alt="AI"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1  px-4 py-4 border border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
              disabled={loading}
            />
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={loading || !title.trim()}
              className="px-6 py-3   text-white "
            >
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomButton;
