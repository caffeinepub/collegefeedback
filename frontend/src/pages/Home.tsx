import React, { useState } from "react";
import { useGetAllPosts, useGetPostsByCategory } from "../hooks/useQueries";
import PostCard from "../components/PostCard";
import ShareWebsiteButtons from "../components/ShareWebsiteButtons";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "../backend";
import { useYearSelection } from "../hooks/useYearSelection";
import YearSelectionModal from "../components/YearSelectionModal";
import { playBubblePop } from "../utils/sounds";

const CATEGORIES = [
  { value: "all" as const, label: "✨ All" },
  { value: Category.internships, label: "💼 Internships" },
  { value: Category.hackathons, label: "⚡ Hackathons" },
  { value: Category.courses, label: "📚 Courses" },
  { value: Category.general, label: "💬 General" },
];

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<"all" | Category>("all");
  const { hasSelected } = useYearSelection();
  const [showYearBanner, setShowYearBanner] = useState(!hasSelected);
  const [showYearModal, setShowYearModal] = useState(false);

  const { data: allPosts, isLoading: allLoading, isError: allError } = useGetAllPosts();
  const {
    data: filteredPosts,
    isLoading: filteredLoading,
    isError: filteredError,
  } = useGetPostsByCategory(
    activeCategory !== "all" ? activeCategory : Category.general
  );

  const posts = activeCategory === "all" ? allPosts : filteredPosts;
  const isLoading = activeCategory === "all" ? allLoading : filteredLoading;
  const isError = activeCategory === "all" ? allError : filteredError;

  const handleCategoryChange = (cat: "all" | Category) => {
    if (cat !== activeCategory) {
      playBubblePop();
      setActiveCategory(cat);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Year Selection Modal (optional) */}
      {showYearModal && (
        <YearSelectionModal onClose={() => setShowYearModal(false)} />
      )}

      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-6 shadow-md">
        <img
          src="/assets/generated/hero-pastel.dim_1200x400.png"
          alt="College campus"
          className="w-full h-48 sm:h-64 object-cover"
        />
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          style={{ background: "oklch(0.55 0.08 50 / 0.45)" }}
        >
          <div className="flex items-center gap-3 mb-2">
            <img
              src="/assets/generated/memu-logo.dim_256x256.png"
              alt="Memu Nerchukunnavi"
              className="w-10 h-10 rounded-full object-cover shadow-md"
              style={{ border: "2px solid oklch(0.99 0.005 58 / 0.7)" }}
            />
            <h1
              className="font-brand text-3xl sm:text-4xl drop-shadow-sm"
              style={{ color: "oklch(0.99 0.005 58)" }}
            >
              Memu Nerchukunnavi
            </h1>
          </div>
          <p
            className="text-sm sm:text-base font-medium max-w-md drop-shadow-sm"
            style={{ color: "oklch(0.97 0.010 58)" }}
          >
            మేము నేర్చుకున్నవి — Open to everyone, free forever 🎓
          </p>
        </div>
      </div>

      {/* Share Website Buttons */}
      <div className="mb-6">
        <ShareWebsiteButtons />
      </div>

      {/* Optional Year Personalization Banner */}
      {showYearBanner && (
        <div
          className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3 mb-6"
          style={{
            background: "oklch(0.95 0.025 58)",
            borderColor: "oklch(0.85 0.030 55)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🎓</span>
            <p className="text-sm" style={{ color: "oklch(0.40 0.06 50)" }}>
              <strong>Personalize your feed</strong> — select your college year to see the most relevant posts.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowYearModal(true)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: "oklch(0.55 0.12 42)",
                color: "oklch(0.99 0.005 58)",
              }}
            >
              Select Year
            </button>
            <button
              onClick={() => setShowYearBanner(false)}
              className="text-xs underline"
              style={{ color: "oklch(0.55 0.05 50)" }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
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
