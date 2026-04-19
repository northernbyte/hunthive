"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, ChevronDown } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "Best elk hunting states?",
  "Recommend a rifle for deer hunting",
  "When is moose season in Alaska?",
  "What gear do I need for a backcountry elk hunt?",
];

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      if (messages.length === 0) {
        // Welcome message
        setMessages([
          {
            role: "assistant",
            content:
              "Hey hunter! I'm HiveAI — your personal hunting expert. Ask me anything about gear, species, locations, tactics, or finding the perfect outfitter. What are you hunting?",
          },
        ]);
      }
    }
  }, [open, minimized, messages.length]);

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }, [messages, open, minimized]);

  const send = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Error: ${data.error}`,
          },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection error. Please check your API key in .env.local and try again.",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center group transition-all duration-200 hover:scale-110"
          style={{ background: "linear-gradient(135deg, #C45A1A, #E8763A)" }}
          title="Ask HiveAI"
        >
          <MessageSquare size={22} color="white" />
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 animate-pulse"
            style={{ background: "#4ade80", borderColor: "#0A0F0A" }}
          />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
            minimized ? "h-14 w-72" : "h-[520px] w-[360px]"
          }`}
          style={{
            background: "#0F1A0F",
            border: "1px solid rgba(196,90,26,0.3)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(196,90,26,0.1)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #C45A1A, #9A4010)" }}
            onClick={() => setMinimized(!minimized)}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={16} color="white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">HiveAI</p>
                <p className="text-orange-200 text-xs">Hunting Expert · Online</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                onClick={(e) => { e.stopPropagation(); setMinimized(!minimized); }}
              >
                <ChevronDown
                  size={16}
                  color="white"
                  style={{ transform: minimized ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
                />
              </div>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                onClick={(e) => { e.stopPropagation(); setOpen(false); setMinimized(false); }}
              >
                <X size={16} color="white" />
              </div>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center mr-2 mt-1 shrink-0"
                        style={{ background: "linear-gradient(135deg, #C45A1A, #E8763A)" }}
                      >
                        <Bot size={12} color="white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user" ? "chat-bubble-user text-white" : "chat-bubble-ai text-gray-100"
                      }`}
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center mr-2 mt-1 shrink-0"
                      style={{ background: "linear-gradient(135deg, #C45A1A, #E8763A)" }}
                    >
                      <Bot size={12} color="white" />
                    </div>
                    <div className="chat-bubble-ai px-4 py-3 flex gap-1.5 items-center">
                      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-orange-400" />
                      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-orange-400" />
                      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-orange-400" />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Suggested prompts */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                  {SUGGESTED_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => send(p)}
                      className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:bg-orange-500/10"
                      style={{
                        borderColor: "rgba(196,90,26,0.35)",
                        color: "#E8763A",
                        background: "rgba(196,90,26,0.06)",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div
                className="px-3 pb-3 pt-2 border-t"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                <div
                  className="flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Ask about gear, species, locations..."
                    className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                  />
                  <button
                    onClick={() => send()}
                    disabled={!input.trim() || loading}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                    style={{ background: input.trim() ? "linear-gradient(135deg, #C45A1A, #E8763A)" : "transparent" }}
                  >
                    <Send size={13} color="white" />
                  </button>
                </div>
                <p className="text-center text-xs text-gray-600 mt-2">
                  Powered by GPT-4o mini · Add key in .env.local
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
