import React, { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import { StudentProfile } from "../backend";
import { useDMConversation, useSendDM } from "../hooks/useQueries";
import { playBubblePop } from "../utils/sounds";
import { useToast } from "../hooks/useToast";

const YEAR_COLORS: Record<string, { bg: string; text: string }> = {
  "1st Year": { bg: "oklch(0.92 0.06 145)", text: "oklch(0.35 0.10 145)" },
  "2nd Year": { bg: "oklch(0.92 0.06 200)", text: "oklch(0.35 0.10 200)" },
  "3rd Year": { bg: "oklch(0.94 0.06 55)", text: "oklch(0.42 0.10 52)" },
  "4th Year": { bg: "oklch(0.92 0.06 280)", text: "oklch(0.38 0.10 280)" },
};

interface DMConversationPanelProps {
  student: StudentProfile;
  senderName: string;
  onClose: () => void;
}

const DMConversationPanel: React.FC<DMConversationPanelProps> = ({
  student,
  senderName,
  onClose,
}) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const { data: messages = [], isLoading } = useDMConversation(
    senderName,
    student.name,
    true
  );

  const { mutate: sendDM, isPending } = useSendDM();

  // Sort messages by timestamp
  const sortedMessages = [...messages].sort(
    (a, b) => Number(a.timestamp) - Number(b.timestamp)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (message.length > 200) {
      showToast("Message must be 200 characters or less.", "error");
      return;
    }

    sendDM(
      { sender: senderName, recipient: student.name, message: message.trim() },
      {
        onSuccess: () => {
          playBubblePop();
          setMessage("");
        },
        onError: () => {
          showToast("Failed to send message. Please try again.", "error");
        },
      }
    );
  };

  function timeAgo(nanoseconds: bigint): string {
    const ms = Number(nanoseconds) / 1_000_000;
    const diff = Date.now() - ms;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "just now";
  }

  const yearColor = YEAR_COLORS[student.collegeYear] ?? YEAR_COLORS["1st Year"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "oklch(0.15 0.02 50 / 0.6)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full sm:w-[420px] rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        style={{
          background: "oklch(0.98 0.015 60)",
          border: "1.5px solid oklch(0.88 0.025 55)",
          maxHeight: "85vh",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
          style={{
            background: "oklch(0.96 0.022 58)",
            borderColor: "oklch(0.88 0.025 55)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold"
              style={{
                background: "oklch(0.88 0.06 55)",
                color: "oklch(0.40 0.10 42)",
              }}
            >
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "oklch(0.30 0.06 48)" }}>
                {student.name}
              </p>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                  style={{ background: yearColor.bg, color: yearColor.text }}
                >
                  {student.collegeYear}
                </span>
                <span className="text-xs" style={{ color: "oklch(0.55 0.04 50)" }}>
                  {student.collegeName}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full transition-colors"
            style={{ color: "oklch(0.52 0.05 50)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <span
                className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: "oklch(0.72 0.08 52)", borderTopColor: "transparent" }}
              />
            </div>
          ) : sortedMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <MessageCircle size={32} style={{ color: "oklch(0.75 0.05 50)" }} />
              <p className="text-sm text-center" style={{ color: "oklch(0.62 0.04 50)" }}>
                No messages yet. Say hello! 👋
              </p>
            </div>
          ) : (
            sortedMessages.map((msg, idx) => {
              const isSender = msg.sender === senderName;
              return (
                <div
                  key={idx}
                  className={`flex flex-col gap-0.5 ${isSender ? "items-end" : "items-start"}`}
                >
                  <span className="text-xs font-medium" style={{ color: "oklch(0.55 0.05 50)" }}>
                    {msg.sender}
                  </span>
                  <div
                    className="px-3 py-2 rounded-2xl text-sm max-w-[80%] break-words"
                    style={
                      isSender
                        ? {
                            background: "oklch(0.55 0.12 42)",
                            color: "oklch(0.99 0.005 58)",
                            borderBottomRightRadius: "4px",
                          }
                        : {
                            background: "oklch(0.93 0.025 58)",
                            color: "oklch(0.30 0.04 50)",
                            borderBottomLeftRadius: "4px",
                          }
                    }
                  >
                    {msg.message}
                  </div>
                  <span className="text-xs" style={{ color: "oklch(0.68 0.04 50)" }}>
                    {timeAgo(msg.timestamp)}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="flex items-end gap-2 px-4 py-3 border-t flex-shrink-0"
          style={{ borderColor: "oklch(0.88 0.025 55)" }}
        >
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e as unknown as React.FormEvent);
                }
              }}
              placeholder="Type a message…"
              rows={1}
              maxLength={200}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none transition-colors"
              style={{
                background: "oklch(0.96 0.015 60)",
                border: "1.5px solid oklch(0.88 0.025 55)",
                color: "oklch(0.30 0.04 50)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "oklch(0.62 0.10 42)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "oklch(0.88 0.025 55)";
              }}
            />
            <div className="text-right mt-0.5">
              <span className="text-xs" style={{ color: "oklch(0.68 0.04 50)" }}>
                {message.length}/200
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={isPending || !message.trim()}
            className="p-2.5 rounded-xl flex-shrink-0 transition-all duration-200 flex items-center justify-center"
            style={{
              background:
                isPending || !message.trim()
                  ? "oklch(0.80 0.04 52)"
                  : "oklch(0.55 0.12 42)",
              color: "oklch(0.99 0.005 58)",
              cursor: isPending || !message.trim() ? "not-allowed" : "pointer",
            }}
          >
            {isPending ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DMConversationPanel;
