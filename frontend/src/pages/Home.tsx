import React, { useState } from "react";
import { useGetAllPosts, useGetPostsByCategory } from "../hooks/useQueries";
import PostCard from "../components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "../backend";

const CATEGORIES = [
  { value: "all" as const, label: "✨ All" },
  { value: Category.internships, label: "💼 Internships" },
  { value: Category.hackathons, label: "⚡ Hackathons" },
  { value: Category.courses, label: "📚 Courses" },
  { value: Category.general, label: "💬 General" },
];

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<"all" | Category>("all");

  const { data: allPosts, isLoading: allLoading, isError: allError } = useGetAllPosts();
  const {
    data: filteredPosts,
    isLoading: filteredLoading,
    isError: filteredError,
  } = useGetPostsByCategory(
    // Always pass a valid Category; when "all" is selected we pass general but won't use the result
    activeCategory !== "all" ? activeCategory : Category.general
  );

  const posts = activeCategory === "all" ? allPosts : filteredPosts;
  const isLoading = activeCategory === "all" ? allLoading : filteredLoading;
  const isError = activeCategory === "all" ? allError : filteredError;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 shadow-md">
        <img
          src="/assets/generated/hero-pastel.dim_1200x400.png"
          alt="College campus"
          className="w-full h-48 sm:h-64 object-cover"
        />
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          style={{ background: "oklch(0.55 0.08 50 / 0.45)" }}
        >
          <h1
            className="font-brand text-3xl sm:text-4xl mb-2 drop-shadow-sm"
            style={{ color: "oklch(0.99 0.005 58)" }}
          >
            Memu నేర్చుకున్నవి
          </h1>
          <p
            className="text-sm sm:text-base font-medium max-w-md drop-shadow-sm"
            style={{ color: "oklch(0.97 0.010 58)" }}
          >
            Real experiences from real students 🎓
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border"
            style={
              activeCategory === cat.value
                ? {
                    background: "oklch(0.55 0.12 42)",
                    color: "oklch(0.99 0.005 58)",
                    borderColor: "oklch(0.55 0.12 42)",
                  }
                : {
                    background: "oklch(0.97 0.012 60)",
                    color: "oklch(0.42 0.06 50)",
                    borderColor: "oklch(0.88 0.025 55)",
                  }
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
      ) : isError ? (
        <div
          className="text-center py-16 rounded-2xl border"
          style={{
            background: "oklch(0.97 0.012 60)",
            borderColor: "oklch(0.88 0.025 55)",
            color: "oklch(0.55 0.18 25)",
          }}
        >
          <p className="text-lg font-semibold mb-1">Failed to load posts</p>
          <p className="text-sm">Please try again later.</p>
        </div>
      ) : !posts || posts.length === 0 ? (
        <div
          className="text-center py-16 rounded-2xl border"
          style={{
            background: "oklch(0.97 0.012 60)",
            borderColor: "oklch(0.88 0.025 55)",
          }}
        >
          <p className="text-4xl mb-3">📭</p>
          <p className="text-lg font-semibold mb-1" style={{ color: "oklch(0.38 0.06 48)" }}>
            No posts yet
          </p>
          <p className="text-sm" style={{ color: "oklch(0.55 0.05 50)" }}>
            Be the first to share your experience!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostCard key={String(post.id)} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
