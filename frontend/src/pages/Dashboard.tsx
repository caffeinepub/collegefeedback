import React from 'react';
import { BarChart2, TrendingUp, FileText, Link2, ThumbsUp } from 'lucide-react';
import { useGetStats } from '../hooks/useQueries';
import CollegeConnectForm from '../components/CollegeConnectForm';
import CollegeConnectList from '../components/CollegeConnectList';
import FeedbackSection from '../components/FeedbackSection';
import FeedbackForm from '../components/FeedbackForm';
import { Category } from '../backend';

const CATEGORY_LABELS: Record<string, string> = {
  [Category.internships]: 'Internships',
  [Category.hackathons]: 'Hackathons',
  [Category.courses]: 'Courses',
  [Category.general]: 'General',
};

export default function Dashboard() {
  const { data: stats, isLoading } = useGetStats();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-heading font-black text-neutral-900 mb-2">
          <span className="italic text-violet-600">Community</span> Dashboard
        </h1>
        <p className="text-neutral-500">Stats, insights, and college connect tips.</p>
      </div>

      {/* Feedback */}
      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold text-neutral-800 mb-4">Student Feedback</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeedbackForm />
          <FeedbackSection />
        </div>
      </section>

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-5 animate-pulse">
              <div className="h-8 bg-neutral-100 rounded-full w-1/2 mb-2" />
              <div className="h-3 bg-neutral-100 rounded-full w-3/4" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-card">
              <div className="flex items-center gap-2 mb-1">
                <FileText size={16} className="text-violet-500" />
                <span className="text-xs text-neutral-500 font-medium">Total Posts</span>
              </div>
              <p className="text-3xl font-black text-neutral-900">{String(stats.totalPosts)}</p>
            </div>
            {stats.categoryCounts.map(([cat, count]) => (
              <div key={String(cat)} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-card">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart2 size={16} className="text-violet-400" />
                  <span className="text-xs text-neutral-500 font-medium">{CATEGORY_LABELS[String(cat)] ?? String(cat)}</span>
                </div>
                <p className="text-3xl font-black text-neutral-900">{String(count)}</p>
              </div>
            ))}
          </div>

          {/* Top posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-card">
              <h3 className="font-heading font-bold text-neutral-800 mb-4 flex items-center gap-2">
                <ThumbsUp size={16} className="text-violet-500" />
                Top Upvoted
              </h3>
              <div className="space-y-3">
                {stats.topUpvotedPosts.slice(0, 5).map((post) => (
                  <div key={String(post.id)} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <span className="text-violet-600 font-black text-sm min-w-[2rem]">↑{String(post.upvotes)}</span>
                    <p className="text-sm text-neutral-700 line-clamp-2">{post.content}</p>
                  </div>
                ))}
                {stats.topUpvotedPosts.length === 0 && (
                  <p className="text-neutral-400 text-sm">No posts yet.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-card">
              <h3 className="font-heading font-bold text-neutral-800 mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-violet-500" />
                Top Connected
              </h3>
              <div className="space-y-3">
                {stats.topConnectedPosts.slice(0, 5).map((post) => (
                  <div key={String(post.id)} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <span className="text-violet-600 font-black text-sm min-w-[2rem]">
                      <Link2 size={12} className="inline" />{String(post.connectCount)}
                    </span>
                    <p className="text-sm text-neutral-700 line-clamp-2">{post.content}</p>
                  </div>
                ))}
                {stats.topConnectedPosts.length === 0 && (
                  <p className="text-neutral-400 text-sm">No posts yet.</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* College Connect */}
      <section>
        <h2 className="text-xl font-heading font-bold text-neutral-800 mb-4">College Connect Tips</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CollegeConnectForm />
          <CollegeConnectList />
        </div>
      </section>
    </div>
  );
}
