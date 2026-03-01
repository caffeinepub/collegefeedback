import React from "react";
import { useParams, Link } from "@tanstack/react-router";
import { ThumbsUp, Users, ArrowLeft, Bookmark, BookmarkCheck } from "lucide-react";
import { useGetAllPosts } from "../hooks/useQueries";
import { useWishlistState } from "../hooks/useWishlist";
import ShareButtons from "../components/ShareButtons";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "../backend";
import { playBubblePop } from "../utils/sounds";
import { categoryConfig, formatTimeAgo } from "../components/PostCard";

const PostDetail: React.FC = () => {
  // Route is defined as /post/$id in App.tsx
  const { id } = useParams({ from: "/post/$id" });
  const { data: posts, isLoading } = useGetAllPosts();

  const post = posts?.find((p) => String(p.id) === id);
  // useWishlistState returns { isSaved, toggleWishlist, isLoading }
  const { isSaved, toggleWishlist, isLoading: wishlistLoading } = useWishlistState(
    post?.id ?? BigInt(0)
  );

  const handleBookmark = () => {
    playBubblePop();
    toggleWishlist();
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Skeleton className="h-6 w-24 mb-6" />
        <div
          className="rounded-2xl border p-6"
          style={{
            background: "oklch(0.97 0.012 60)",
            borderColor: "oklch(0.88 0.025 55)",
          }}
        >
          <Skeleton className="h-5 w-32 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-lg font-semibold mb-2" style={{ color: "oklch(0.38 0.06 48)" }}>
          Post not found
        </p>
        <Link
          to="/"
          className="text-sm font-medium"
          style={{ color: "oklch(0.50 0.10 42)" }}
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  const catConfig = categoryConfig[post.category] ?? categoryConfig[Category.general];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors"
        style={{ color: "oklch(0.50 0.08 48)" }}
      >
        <ArrowLeft size={16} />
        Back to Feed
      </Link>

      {/* Post Card */}
      <article
        className="rounded-2xl border p-6 mb-6"
        style={{
          background: "oklch(0.98 0.015 60)",
          borderColor: "oklch(0.88 0.025 55)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="inline-flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full"
              style={{
                background: catConfig.bg,
                color: catConfig.color,
              }}
            >
              {catConfig.emoji} {catConfig.label}
            </span>
            <span
              className="text-sm px-3 py-1 rounded-full font-medium"
              style={{
                background: "oklch(0.92 0.025 55)",
                color: "oklch(0.45 0.06 50)",
              }}
            >
              {post.authorYear}
            </span>
          </div>

          <button
            onClick={handleBookmark}
            disabled={wishlistLoading}
            className="p-2 rounded-full transition-colors flex-shrink-0"
            style={{
              color: isSaved ? "oklch(0.55 0.12 42)" : "oklch(0.65 0.04 50)",
              background: isSaved ? "oklch(0.92 0.04 55)" : "transparent",
            }}
            title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
          >
            {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          </button>
        </div>

        {/* Content */}
        <p
          className="text-base leading-relaxed mb-5 whitespace-pre-wrap"
          style={{ color: "oklch(0.30 0.04 50)" }}
        >
          {post.content}
        </p>

        {/* Stats */}
        <div
          className="flex items-center gap-4 pt-4 border-t"
          style={{ borderColor: "oklch(0.88 0.025 55)" }}
        >
          <span
            className="flex items-center gap-1.5 text-sm"
            style={{ color: "oklch(0.52 0.05 50)" }}
          >
            <ThumbsUp size={15} />
            {String(post.upvotes)} upvotes
          </span>
          <span
            className="flex items-center gap-1.5 text-sm"
            style={{ color: "oklch(0.52 0.05 50)" }}
          >
            <Users size={15} />
            {String(post.connectCount)} connects
          </span>
          <span className="ml-auto text-sm" style={{ color: "oklch(0.62 0.04 50)" }}>
            {formatTimeAgo(post.createdAt)}
          </span>
        </div>
      </article>

      {/* Share */}
      <div
        className="rounded-2xl border p-4"
        style={{
          background: "oklch(0.96 0.018 58)",
          borderColor: "oklch(0.88 0.025 55)",
        }}
      >
        <p
          className="text-sm font-semibold mb-3"
          style={{ color: "oklch(0.38 0.06 48)" }}
        >
          Share this experience
        </p>
        <ShareButtons postId={post.id} content={post.content} />
      </div>
    </div>
  );
};

export default PostDetail;
