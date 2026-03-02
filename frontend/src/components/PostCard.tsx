import React from "react";
import { Link } from "@tanstack/react-router";
import { ThumbsUp, Users, Bookmark, BookmarkCheck } from "lucide-react";
import { Post, Category } from "../backend";
import { useWishlistState } from "../hooks/useWishlist";
import { playBubblePop } from "../utils/sounds";
import { useToast } from "../hooks/useToast";

export const categoryConfig: Record<
  Category,
  { emoji: string; label: string; color: string; bg: string }
> = {
  [Category.internships]: {
    emoji: "💼",
    label: "Internships",
    color: "oklch(0.40 0.10 42)",
    bg: "oklch(0.92 0.04 55)",
  },
  [Category.hackathons]: {
    emoji: "⚡",
    label: "Hackathons",
    color: "oklch(0.42 0.12 60)",
    bg: "oklch(0.94 0.05 72)",
  },
  [Category.courses]: {
    emoji: "📚",
    label: "Courses",
    color: "oklch(0.38 0.10 200)",
    bg: "oklch(0.92 0.04 200)",
  },
  [Category.general]: {
    emoji: "💬",
    label: "General",
    color: "oklch(0.40 0.08 280)",
    bg: "oklch(0.93 0.03 280)",
  },
};

export function formatTimeAgo(nanoseconds: bigint): string {
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

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const catConfig = categoryConfig[post.category] ?? categoryConfig[Category.general];
  const { isSaved, toggleWishlist, isLoading } = useWishlistState(post.id);
  const { showToast } = useToast();

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playBubblePop();
    const willSave = !isSaved;
    toggleWishlist();
    showToast(
      willSave ? "✨ Added to wishlist!" : "Removed from wishlist",
      willSave ? "success" : "info"
    );
  };

  return (
    <Link to="/post/$id" params={{ id: String(post.id) }}>
      <article
        className="rounded-xl border p-4 transition-all duration-200 hover:shadow-md cursor-pointer group"
        style={{
          background: "oklch(0.98 0.015 60)",
          borderColor: "oklch(0.88 0.025 55)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.72 0.08 52)";
          (e.currentTarget as HTMLElement).style.background = "oklch(0.99 0.010 58)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.88 0.025 55)";
          (e.currentTarget as HTMLElement).style.background = "oklch(0.98 0.015 60)";
        }}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category badge */}
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: catConfig.bg,
                color: catConfig.color,
              }}
            >
              {catConfig.emoji} {catConfig.label}
            </span>
            {/* Year badge */}
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: "oklch(0.92 0.025 55)",
                color: "oklch(0.45 0.06 50)",
              }}
            >
              {post.authorYear}
            </span>
          </div>

          {/* Bookmark */}
          <button
            onClick={handleBookmark}
            disabled={isLoading}
            className="p-1 rounded-full transition-colors flex-shrink-0"
            style={{ color: isSaved ? "oklch(0.55 0.12 42)" : "oklch(0.65 0.04 50)" }}
            title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
          >
            {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>

        {/* Content */}
        <p
          className="text-sm leading-relaxed line-clamp-3 mb-3"
          style={{ color: "oklch(0.32 0.04 50)" }}
        >
          {post.content}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: "oklch(0.55 0.05 50)" }}
            >
              <ThumbsUp size={13} />
              {String(post.upvotes)}
            </span>
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: "oklch(0.55 0.05 50)" }}
            >
              <Users size={13} />
              {String(post.connectCount)}
            </span>
          </div>
          <span className="text-xs" style={{ color: "oklch(0.62 0.04 50)" }}>
            {formatTimeAgo(post.createdAt)}
          </span>
        </div>
      </article>
    </Link>
  );
};

export default PostCard;
