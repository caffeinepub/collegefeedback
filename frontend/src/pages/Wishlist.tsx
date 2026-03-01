import React from "react";
import { useGetAllPosts, useGetWishlist } from "../hooks/useQueries";
import { useWishlistSession } from "../hooks/useWishlist";
import PostCard from "../components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";

const Wishlist: React.FC = () => {
  // useWishlistSession returns a string directly (not an object)
  const sessionKey = useWishlistSession();
  const { data: wishlistIds, isLoading: wishlistLoading } = useGetWishlist(sessionKey);
  const { data: allPosts, isLoading: postsLoading } = useGetAllPosts();

  const isLoading = wishlistLoading || postsLoading;

  const savedPosts = React.useMemo(() => {
    if (!allPosts || !wishlistIds) return [];
    const idSet = new Set(wishlistIds.map((id) => String(id)));
    return allPosts.filter((p) => idSet.has(String(p.id)));
  }, [allPosts, wishlistIds]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1
        className="font-heading text-2xl font-bold mb-6"
        style={{ color: "oklch(0.35 0.08 48)" }}
      >
        🔖 My Wishlist
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl border p-4"
              style={{
                background: "oklch(0.97 0.012 60)",
                borderColor: "oklch(0.88 0.025 55)",
              }}
            >
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-5/6 mb-2" />
              <Skeleton className="h-3 w-4/6" />
            </div>
          ))}
        </div>
      ) : savedPosts.length === 0 ? (
        <div
          className="text-center py-16 rounded-2xl border"
          style={{
            background: "oklch(0.97 0.012 60)",
            borderColor: "oklch(0.88 0.025 55)",
          }}
        >
          <p className="text-4xl mb-3">🔖</p>
          <p
            className="text-lg font-semibold mb-1"
            style={{ color: "oklch(0.38 0.06 48)" }}
          >
            No saved posts yet
          </p>
          <p className="text-sm mb-4" style={{ color: "oklch(0.55 0.05 50)" }}>
            Bookmark posts you find helpful to revisit them here.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{
              background: "oklch(0.55 0.12 42)",
              color: "oklch(0.99 0.005 58)",
            }}
          >
            Browse Posts →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savedPosts.map((post) => (
            <PostCard key={String(post.id)} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
