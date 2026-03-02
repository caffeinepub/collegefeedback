import React from "react";
import { useFeedback } from "../hooks/useQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquareDashed } from "lucide-react";

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

const FeedbackSection: React.FC = () => {
  const { data: feedbackEntries, isLoading, isError, error } = useFeedback();

  // Check if it's an authorization error (admin-only endpoint)
  const isAuthError =
    isError &&
    error instanceof Error &&
    (error.message.includes("Unauthorized") || error.message.includes("admin"));

  if (isAuthError) {
    return (
      <div
        className="rounded-xl border p-5 text-center"
        style={{
          background: "oklch(0.97 0.012 60)",
          borderColor: "oklch(0.88 0.025 55)",
        }}
      >
        <p className="text-sm" style={{ color: "oklch(0.55 0.05 50)" }}>
          🔒 Feedback is visible to admins only. Submit yours below!
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border p-4"
            style={{
              background: "oklch(0.97 0.012 60)",
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
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="rounded-xl border p-5 text-center"
        style={{
          background: "oklch(0.97 0.012 60)",
          borderColor: "oklch(0.88 0.025 55)",
        }}
      >
        <p className="text-sm" style={{ color: "oklch(0.55 0.18 25)" }}>
          Failed to load feedback.
        </p>
      </div>
    );
  }

  if (!feedbackEntries || feedbackEntries.length === 0) {
    return (
      <div
        className="rounded-xl border p-8 text-center flex flex-col items-center gap-2"
        style={{
          background: "oklch(0.97 0.012 60)",
          borderColor: "oklch(0.88 0.025 55)",
        }}
      >
        <MessageSquareDashed size={28} style={{ color: "oklch(0.75 0.05 50)" }} />
        <p className="text-sm" style={{ color: "oklch(0.62 0.04 50)" }}>
          No feedback yet. Be the first to share! 🌟
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
      {feedbackEntries.map((entry, idx) => {
        const yearColor = YEAR_COLORS[entry.collegeYear] ?? YEAR_COLORS["1st Year"];
        return (
          <div
            key={idx}
            className="rounded-xl border p-4"
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
                  {entry.authorName.charAt(0).toUpperCase()}
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "oklch(0.32 0.06 48)" }}
                >
                  {entry.authorName}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: yearColor.bg,
                    color: yearColor.text,
                    border: `1px solid ${yearColor.border}`,
                  }}
                >
                  {entry.collegeYear}
                </span>
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: "oklch(0.62 0.04 50)" }}>
                {timeAgo(entry.timestamp)}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "oklch(0.32 0.04 50)" }}>
              {entry.feedback}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default FeedbackSection;
