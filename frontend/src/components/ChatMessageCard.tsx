import React from "react";
import { ChatMessage } from "../backend";

const YEAR_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "1st Year": { bg: "oklch(0.92 0.06 145)", text: "oklch(0.35 0.10 145)", border: "oklch(0.78 0.08 145)" },
  "2nd Year": { bg: "oklch(0.92 0.06 200)", text: "oklch(0.35 0.10 200)", border: "oklch(0.78 0.08 200)" },
  "3rd Year": { bg: "oklch(0.94 0.06 55)", text: "oklch(0.42 0.10 52)", border: "oklch(0.80 0.08 55)" },
  "4th Year": { bg: "oklch(0.92 0.06 280)", text: "oklch(0.38 0.10 280)", border: "oklch(0.78 0.08 280)" },
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

interface ChatMessageCardProps {
  message: ChatMessage;
}

const ChatMessageCard: React.FC<ChatMessageCardProps> = ({ message }) => {
  const yearColor = YEAR_COLORS[message.collegeYear] ?? YEAR_COLORS["1st Year"];

  return (
    <div
      className="rounded-xl border p-4 transition-all duration-200"
      style={{
        background: "oklch(0.98 0.015 60)",
        borderColor: "oklch(0.88 0.025 55)",
      }}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{
              background: "oklch(0.88 0.06 55)",
              color: "oklch(0.40 0.10 42)",
            }}
          >
            {message.authorName.charAt(0).toUpperCase()}
          </div>
          <span
            className="text-sm font-semibold"
            style={{ color: "oklch(0.32 0.06 48)" }}
          >
            {message.authorName}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{
              background: yearColor.bg,
              color: yearColor.text,
              border: `1px solid ${yearColor.border}`,
            }}
          >
            {message.collegeYear}
          </span>
        </div>
        <span className="text-xs flex-shrink-0" style={{ color: "oklch(0.62 0.04 50)" }}>
          {timeAgo(message.timestamp)}
        </span>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "oklch(0.32 0.04 50)" }}>
        {message.message}
      </p>
    </div>
  );
};

export default ChatMessageCard;
