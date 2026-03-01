import React from "react";
import { useGetCollegeConnects } from "../hooks/useQueries";
import { Skeleton } from "@/components/ui/skeleton";

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

const CollegeConnectList: React.FC = () => {
  const { data: connects, isLoading, isError } = useGetCollegeConnects();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl p-3 border"
            style={{
              background: "oklch(0.97 0.012 60)",
              borderColor: "oklch(0.88 0.025 55)",
            }}
          >
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-center py-4" style={{ color: "oklch(0.55 0.18 25)" }}>
        Failed to load tips.
      </p>
    );
  }

  if (!connects || connects.length === 0) {
    return (
      <p className="text-sm text-center py-4" style={{ color: "oklch(0.62 0.04 50)" }}>
        No tips yet. Be the first to share! 🌟
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
      {connects.map((c) => {
        const yearColor = YEAR_COLORS[c.year] ?? YEAR_COLORS["1st Year"];
        return (
          <div
            key={String(c.id)}
            className="rounded-xl p-3 border"
            style={{
              background: "oklch(0.98 0.012 60)",
              borderColor: "oklch(0.88 0.025 55)",
            }}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-xs font-bold"
                  style={{ color: "oklch(0.38 0.06 48)" }}
                >
                  {c.collegeName}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: yearColor.bg,
                    color: yearColor.text,
                    border: `1px solid ${yearColor.border}`,
                  }}
                >
                  {c.year}
                </span>
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: "oklch(0.62 0.04 50)" }}>
                {timeAgo(c.createdAt)}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "oklch(0.35 0.04 50)" }}>
              {c.tip}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default CollegeConnectList;
