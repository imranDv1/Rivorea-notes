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
import { Copy, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

const AI_AVATAR = "/icons/note ai.png";
const PLACEHOLDER_AVATAR =
  "https://api.dicebear.com/7.x/lorelei/svg?seed=user&backgroundColor=transparent";

type Message = {
  from: "user" | "ai";
  name: string;
  avatar: string;
  text: string;
};

function MessageBubble({
  msg,
  isAi,
  onCopy,
}: {
  msg: Message;
  isAi: boolean;
  onCopy?: (text: string) => void;
}) {
  const renderContent = (text: string) => {
    // Only highlight AI messages as code
    if (!isAi) {
      return <span className="whitespace-pre-wrap">{text}</span>;
    }

    // Detect markdown-style ``` code blocks or indented code
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];

    let lastIndex = 0;
    let match;
    let idx = 0;
    codeBlockRegex.lastIndex = 0;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      const before = text.slice(lastIndex, match.index);
      if (before.trim()) {
        parts.push(
          <span key={idx++} className="whitespace-pre-wrap">
            {before}
          </span>
        );
      }
      const code = match[1].trim();
      let language = "javascript";
      if (/python/i.test(code)) language = "python";
      else if (/function|console\.log|let |const |var /.test(code))
        language = "javascript";
      else if (/CREATE TABLE|SELECT |INSERT |UPDATE |DELETE /.test(code))
        language = "sql";
      else if (/<!DOCTYPE html>|<html>|<div|<\/div>/.test(code))
        language = "html";
      else if (/^#include |int main\s*\(/.test(code)) language = "cpp";

      parts.push(
        <SyntaxHighlighter
          key={idx++}
          language={language}
          style={vscDarkPlus}
          className="rounded-md my-2 text-xs !p-3"
          wrapLongLines
        >
          {code}
        </SyntaxHighlighter>
      );

      lastIndex = codeBlockRegex.lastIndex;
    }

    const remaining = text.slice(lastIndex);
    if (remaining.trim()) {
      parts.push(
        <span key={idx++} className="whitespace-pre-wrap">
          {remaining}
        </span>
      );
    }

    return parts;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: isAi ? -20 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: isAi ? -10 : 10 }}
      transition={{ duration: 0.25 }}
      className={`flex items-end gap-3 group ${
        isAi ? "flex-row" : "flex-row-reverse"
      }`}
    >
      <Image
        src={msg.avatar}
        alt={msg.name}
        width={38}
        height={38}
        className="rounded-full object-cover w-9 h-9 border border-gray-200 dark:border-neutral-700"
      />
      <div
        className={`max-w-[80vw] md:max-w-lg flex flex-col ${
          isAi ? "" : "items-end"
        }`}
      >
        <span
          className={`font-medium text-xs mb-1 select-none ${
            isAi ? "text-gray-700 dark:text-neutral-300" : "text-primary"
          }`}
        >
          {msg.name}
        </span>
        <div
          className={`relative group/chat px-4 py-3 text-sm rounded-2xl whitespace-pre-wrap break-words 
            ${
              isAi
                ? "bg-gradient-to-tr from-gray-50 to-gray-200 dark:from-[#000] dark:to-[#111] text-neutral-900 dark:text-neutral-50 border border-gray-200 dark:border-neutral-700 shadow"
                : "bg-primary text-white border border-primary/10"
            }`}
        >
          {renderContent(msg.text)}
          {isAi && (
            <div className="absolute top-2 right-3 flex items-center gap-2 opacity-0 group-hover/chat:opacity-100 transition-opacity">
              <button
                onClick={() => onCopy && onCopy(msg.text)}
                className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-white/70 dark:bg-neutral-800/80 px-1.5 py-0.5 rounded flex items-center gap-1"
                tabIndex={-1}
                title="Copy response"
              >
                <Copy size={14} />
                Copy
              </button>
              <button
                onClick={() => {
                  try {
                    const event = new CustomEvent("rivorea-insert-note", {
                      detail: { text: msg.text },
                    });
                    window.dispatchEvent(event);
                  } catch {}
                }}
                className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-white/70 dark:bg-neutral-800/80 px-1.5 py-0.5 rounded"
                tabIndex={-1}
                title="Write to editor"
              >
                Write
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const removeDialogOutlineStyle = (
  <style jsx global>{`
    .fixed[data-state="open"],
    .fixed[data-state="closed"],
    .fixed[data-state="open"]:focus-visible,
    .fixed[data-state="closed"]:focus-visible {
      outline: none !important;
      box-shadow: none !important;
    }
    button[aria-haspopup="dialog"]:focus-visible,
    button[aria-haspopup="dialog"]:focus {
      outline: none !important;
      box-shadow: none !important;
    }
    .dialog-content:focus-visible,
    .dialog-content:focus,
    .dialog-trigger:focus-visible,
    .dialog-trigger:focus {
      outline: none !important;
      box-shadow: none !important;
    }
  `}</style>
);

const CustomButton = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const userName = user?.name || "You";
  const userImage = user?.image || PLACEHOLDER_AVATAR;

  const [title, setTitle] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "ai",
      name: "NoteBuddy",
      avatar: AI_AVATAR,
      text: "Hello 👋! How may I assist you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = async () => {
    if (!title.trim() || loading) return;

    const userMsg: Message = {
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
        body: JSON.stringify({
          userId: user?.id,
          title: title,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.body) {
        toast.error(data.message || "Failed to get AI response.");
        setMessages((prev) => [
          ...prev,
          {
            from: "ai",
            name: "NoteBuddy",
            avatar: AI_AVATAR,
            text: data.message || "Sorry, something went wrong.",
          },
        ]);
        return;
      }

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
      toast.error("An unexpected error occurred.");
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
    <>
      {removeDialogOutlineStyle}
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="group relative rounded-xl overflow-hidden p-px shadow transition hover:scale-105 bg-gradient-to-r from-indigo-500 via-pink-400 to-orange-400 focus:outline-none focus-visible:outline-none"
            tabIndex={0}
          >
            <span className="flex items-center justify-center gap-1 bg-white dark:bg-neutral-950 rounded-xl py-2 px-4 w-full">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="opacity-80"
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
              <span className="text-sm font-semibold bg-gradient-to-b from-black to-black/60 dark:from-white dark:to-white/50 bg-clip-text text-transparent">
                AI
              </span>
            </span>
          </button>
        </DialogTrigger>

        <DialogContent className="max-w-6xl w-[95vw] h-[80vh] flex flex-col p-0 overflow-hidden rounded-2xl shadow-2xl dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md focus:outline-none focus-visible:outline-none">
          <DialogHeader className="sticky top-0 z-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-b dark:border-neutral-800 px-6 py-4">
            <DialogTitle className="text-lg flex items-center gap-3 font-semibold">
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

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <MessageBubble
                  key={idx}
                  msg={msg}
                  isAi={msg.from === "ai"}
                  onCopy={copyToClipboard}
                />
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-end gap-3 px-4 py-2"
              >
                <Image
                  src={AI_AVATAR}
                  alt="AI"
                  width={36}
                  height={36}
                  className="rounded-full object-cover w-9 h-9 border border-gray-200 dark:border-neutral-700"
                />
                <span className="bg-gradient-to-tr from-gray-50 to-gray-200 dark:from-[#000] dark:to-[#111] text-neutral-900 dark:text-neutral-50 border border-gray-200 dark:border-neutral-700 rounded-2xl px-4 py-3 text-sm flex items-center">
                  <Loader2 className="animate-spin mr-2" size={17} />
                  NoteBuddy is thinking...
                </span>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            className="sticky bottom-0 p-5 flex items-end gap-3 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message…"
              className="flex-1 px-4 py-4 border border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary font-medium rounded-md bg-white/70 dark:bg-neutral-900/80 transition"
              disabled={loading}
              autoFocus
            />
            <Button
              type="submit"
              size="lg"
              disabled={loading || !title.trim()}
              className={`px-6 py-3 rounded-lg text-white font-semibold bg-primary transition disabled:opacity-60 ${
                loading || !title.trim() ? "cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Send"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomButton;
