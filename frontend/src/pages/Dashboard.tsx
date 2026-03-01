import React from "react";
import { useGetStats } from "../hooks/useQueries";
import { Skeleton } from "@/components/ui/skeleton";
import PostCard from "../components/PostCard";
import CollegeConnectForm from "../components/CollegeConnectForm";
import CollegeConnectList from "../components/CollegeConnectList";
import { Category } from "../backend";

const CATEGORY_LABELS: Record<string, string> = {
  [Category.internships]: "💼 Internships",
  [Category.hackathons]: "⚡ Hackathons",
  [Category.courses]: "📚 Courses",
  [Category.general]: "💬 General",
};

const Dashboard: React.FC = () => {
  const { data: stats, isLoading, isError } = useGetStats();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1
        className="font-heading text-2xl font-bold mb-6"
        style={{ color: "oklch(0.35 0.08 48)" }}
      >
        📊 Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {/* Total Posts */}
        <div
          className="rounded-xl border p-4 text-center"
          style={{
            background: "oklch(0.96 0.025 58)",
            borderColor: "oklch(0.88 0.025 55)",
          }}
        >
          {isLoading ? (
            <Skeleton className="h-8 w-12 mx-auto mb-1" />
          ) : (
            <p
              className="text-3xl font-bold font-heading"
              style={{ color: "oklch(0.45 0.10 42)" }}
            >
              {isError ? "—" : String(stats?.totalPosts ?? 0)}
            </p>
          )}
          <p className="text-xs font-medium mt-1" style={{ color: "oklch(0.55 0.05 50)" }}>
            Total Posts
          </p>
        </div>

        {/* Category counts */}
        {isLoading
          ? [1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl border p-4 text-center"
                style={{
                  background: "oklch(0.96 0.025 58)",
                  borderColor: "oklch(0.88 0.025 55)",
                }}
              >
                <Skeleton className="h-8 w-12 mx-auto mb-1" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            ))
          : stats?.categoryCounts.map(([cat, count]) => (
              <div
                key={String(cat)}
                className="rounded-xl border p-4 text-center"
                style={{
                  background: "oklch(0.96 0.025 58)",
                  borderColor: "oklch(0.88 0.025 55)",
                }}
              >
                <p
                  className="text-3xl font-bold font-heading"
                  style={{ color: "oklch(0.45 0.10 42)" }}
                >
                  {String(count)}
                </p>
                <p className="text-xs font-medium mt-1" style={{ color: "oklch(0.55 0.05 50)" }}>
                  {CATEGORY_LABELS[String(cat)] ?? String(cat)}
                </p>
              </div>
            ))}
      </div>

      {/* Main content: posts + college connect */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posts columns */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Top Upvoted */}
          <section>
            <h2
              className="font-heading text-lg font-bold mb-3"
              style={{ color: "oklch(0.38 0.07 48)" }}
            >
              🔥 Top Upvoted
            </h2>
            {isLoading ? (
              <div className="flex flex-col gap-3">
                {[1, 2].map((i) => (
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
                    <Skeleton className="h-3 w-5/6" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <p className="text-sm" style={{ color: "oklch(0.55 0.18 25)" }}>
                Failed to load.
              </p>
            ) : stats?.topUpvotedPosts.length === 0 ? (
              <p className="text-sm" style={{ color: "oklch(0.62 0.04 50)" }}>
                No posts yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {stats?.topUpvotedPosts.map((post) => (
                  <PostCard key={String(post.id)} post={post} />
                ))}
              </div>
            )}
          </section>

          {/* Top Connected */}
          <section>
            <h2
              className="font-heading text-lg font-bold mb-3"
              style={{ color: "oklch(0.38 0.07 48)" }}
            >
              🤝 Most Connected
            </h2>
            {isLoading ? (
              <div className="flex flex-col gap-3">
                {[1, 2].map((i) => (
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
                    <Skeleton className="h-3 w-5/6" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <p className="text-sm" style={{ color: "oklch(0.55 0.18 25)" }}>
                Failed to load.
              </p>
            ) : stats?.topConnectedPosts.length === 0 ? (
              <p className="text-sm" style={{ color: "oklch(0.62 0.04 50)" }}>
                No posts yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {stats?.topConnectedPosts.map((post) => (
                  <PostCard key={String(post.id)} post={post} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* College Connect sidebar */}
        <aside className="lg:col-span-1">
          <div
            className="rounded-2xl border p-5 sticky top-24"
            style={{
              background: "oklch(0.97 0.018 60)",
              borderColor: "oklch(0.88 0.025 55)",
            }}
          >
            <h2
              className="font-heading text-lg font-bold mb-4"
              style={{ color: "oklch(0.38 0.07 48)" }}
            >
              🤝 College Connect
            </h2>
            <CollegeConnectForm />
            <div
              className="my-4 border-t"
              style={{ borderColor: "oklch(0.88 0.025 55)" }}
            />
            <h3
              className="font-heading text-sm font-bold mb-3"
              style={{ color: "oklch(0.45 0.06 50)" }}
            >
              Recent Tips
            </h3>
            <CollegeConnectList />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
