import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send } from "lucide-react";
import { useChatMessages, usePostChatMessage } from "../hooks/useQueries";
import { Skeleton } from "@/components/ui/skeleton";
import ChatMessageCard from "../components/ChatMessageCard";
import { playBubblePop } from "../utils/sounds";
import { useToast } from "../hooks/useToast";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const CommunityChat: React.FC = () => {
  const [authorName, setAuthorName] = useState("");
  const [year, setYear] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const { data: messages = [], isLoading, isError } = useChatMessages(50);
  const { mutate: postMessage, isPending } = usePostChatMessage();

  // Sort messages newest-first for display, but scroll to bottom
  const sortedMessages = [...messages].sort(
    (a, b) => Number(a.timestamp) - Number(b.timestamp)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages.length]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!authorName.trim()) e.authorName = "Name is required.";
    if (!year) e.year = "Please select your year.";
    if (!message.trim()) e.message = "Message cannot be empty.";
    if (message.length > 200) e.message = "Message must be 200 characters or less.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    postMessage(
      { author: authorName.trim(), year, message: message.trim() },
      {
        onSuccess: () => {
          playBubblePop();
          showToast("💬 Message posted!", "success");
          setMessage("");
        },
        onError: () => {
          showToast("Failed to post message. Please try again.", "error");
        },
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1
          className="font-heading text-2xl font-bold flex items-center gap-2"
          style={{ color: "oklch(0.35 0.08 48)" }}
        >
          <MessageSquare size={24} style={{ color: "oklch(0.55 0.12 42)" }} />
          Community Chat
        </h1>
        <p className="text-sm mt-1" style={{ color: "oklch(0.55 0.05 50)" }}>
          A public space for students to chat, ask questions, and share quick thoughts.
        </p>
      </div>

      {/* Messages Feed */}
      <div
        className="rounded-2xl border mb-6 overflow-hidden"
        style={{
          background: "oklch(0.97 0.012 60)",
          borderColor: "oklch(0.88 0.025 55)",
        }}
      >
        <div
          className="px-4 py-3 border-b flex items-center gap-2"
          style={{
            background: "oklch(0.96 0.022 58)",
            borderColor: "oklch(0.88 0.025 55)",
          }}
        >
          <span className="text-sm font-semibold" style={{ color: "oklch(0.38 0.07 48)" }}>
            💬 Live Chat
          </span>
          {!isLoading && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "oklch(0.88 0.06 55)",
                color: "oklch(0.40 0.08 50)",
              }}
            >
              {sortedMessages.length} messages
            </span>
          )}
        </div>

        <div className="p-4 flex flex-col gap-3 max-h-[480px] overflow-y-auto">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border p-4"
                  style={{
                    background: "oklch(0.98 0.015 60)",
                    borderColor: "oklch(0.88 0.025 55)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="w-7 h-7 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              ))}
            </>
          ) : isError ? (
            <p className="text-sm text-center py-6" style={{ color: "oklch(0.55 0.18 25)" }}>
              Failed to load messages. Please try again.
            </p>
          ) : sortedMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <MessageSquare size={36} style={{ color: "oklch(0.75 0.05 50)" }} />
              <p className="text-sm text-center" style={{ color: "oklch(0.62 0.04 50)" }}>
                No messages yet. Start the conversation! 🌟
              </p>
            </div>
          ) : (
            sortedMessages.map((msg, idx) => (
              <ChatMessageCard key={idx} message={msg} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Post Message Form */}
      <div
        className="rounded-2xl border p-5"
        style={{
          background: "oklch(0.97 0.018 60)",
          borderColor: "oklch(0.88 0.025 55)",
        }}
      >
        <h2
          className="font-heading text-base font-bold mb-4"
          style={{ color: "oklch(0.38 0.07 48)" }}
        >
          ✍️ Post a Message
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.38 0.06 48)" }}>
                Your Name *
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Ravi Kumar"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors"
                style={{
                  background: "oklch(0.97 0.012 60)",
                  border: `1.5px solid ${errors.authorName ? "oklch(0.55 0.18 25)" : "oklch(0.88 0.025 55)"}`,
                  color: "oklch(0.30 0.04 50)",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "oklch(0.62 0.10 42)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = errors.authorName ? "oklch(0.55 0.18 25)" : "oklch(0.88 0.025 55)"; }}
              />
              {errors.authorName && (
                <p className="text-xs mt-1" style={{ color: "oklch(0.55 0.18 25)" }}>{errors.authorName}</p>
              )}
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.38 0.06 48)" }}>
                Year *
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors"
                style={{
                  background: "oklch(0.97 0.012 60)",
                  border: `1.5px solid ${errors.year ? "oklch(0.55 0.18 25)" : "oklch(0.88 0.025 55)"}`,
                  color: year ? "oklch(0.30 0.04 50)" : "oklch(0.62 0.04 50)",
                }}
              >
                <option value="">Select year…</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              {errors.year && (
                <p className="text-xs mt-1" style={{ color: "oklch(0.55 0.18 25)" }}>{errors.year}</p>
              )}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.38 0.06 48)" }}>
              Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share a thought, ask a question, or say hello…"
              rows={3}
              maxLength={200}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors resize-none"
              style={{
                background: "oklch(0.97 0.012 60)",
                border: `1.5px solid ${errors.message ? "oklch(0.55 0.18 25)" : "oklch(0.88 0.025 55)"}`,
                color: "oklch(0.30 0.04 50)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "oklch(0.62 0.10 42)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = errors.message ? "oklch(0.55 0.18 25)" : "oklch(0.88 0.025 55)"; }}
            />
            <div className="flex justify-between items-center mt-0.5">
              {errors.message ? (
                <p className="text-xs" style={{ color: "oklch(0.55 0.18 25)" }}>{errors.message}</p>
              ) : <span />}
              <span className="text-xs" style={{ color: "oklch(0.62 0.04 50)" }}>
                {message.length}/200
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: isPending ? "oklch(0.75 0.06 52)" : "oklch(0.55 0.12 42)",
              color: "oklch(0.99 0.005 58)",
              cursor: isPending ? "not-allowed" : "pointer",
            }}
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Posting…
              </>
            ) : (
              <>
                <Send size={15} />
                Post Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommunityChat;
