import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, BookOpen, Trophy, Briefcase, MessageSquare, GraduationCap } from 'lucide-react';
import { useGetAllPosts } from '../hooks/useQueries';
import PostCard from '../components/PostCard';
import ShareWebsiteButtons from '../components/ShareWebsiteButtons';
import YearSelectionModal from '../components/YearSelectionModal';
import { useYearSelection } from '../hooks/useYearSelection';
import { Category } from '../backend';
import { playBubblePop } from '../utils/sounds';

const CATEGORIES = [
  { key: 'all', label: 'All', icon: BookOpen },
  { key: Category.internships, label: 'Internships', icon: Briefcase },
  { key: Category.hackathons, label: 'Hackathons', icon: Trophy },
  { key: Category.courses, label: 'Courses', icon: BookOpen },
  { key: Category.general, label: 'General', icon: MessageSquare },
];

const YEAR_EMOJIS: Record<string, string> = {
  '1st Year': '🌱',
  '2nd Year': '📚',
  '3rd Year': '🚀',
  '4th Year': '🎓',
};

export default function Home() {
  const navigate = useNavigate();
  const { data: posts, isLoading } = useGetAllPosts();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showYearModal, setShowYearModal] = useState(false);

  // Re-read year from sessionStorage reactively
  const [, forceUpdate] = useState(0);
  const { year, hasSelected } = useYearSelection();

  // Listen for year-selected event to re-render
  useEffect(() => {
    const handler = () => forceUpdate((n) => n + 1);
    window.addEventListener('year-selected', handler);
    return () => window.removeEventListener('year-selected', handler);
  }, []);

  // Show modal on first visit (no year stored)
  useEffect(() => {
    if (!hasSelected) {
      const timer = setTimeout(() => setShowYearModal(true), 600);
      return () => clearTimeout(timer);
    }
  }, [hasSelected]);

  const filteredPosts = posts
    ? (() => {
        let result = posts;
        // Filter by year if selected
        if (hasSelected && year) {
          result = result.filter((p) => p.authorYear === year);
          // If no posts match the year, fall back to all posts
          if (result.length === 0) result = posts;
        }
        // Filter by category
        if (activeCategory !== 'all') {
          result = result.filter((p) => p.category === activeCategory);
        }
        return result;
      })()
    : [];

  const handleCategoryChange = (cat: string) => {
    playBubblePop();
    setActiveCategory(cat);
  };

  const handleYearModalClose = () => {
    setShowYearModal(false);
    forceUpdate((n) => n + 1);
  };

  return (
    <>
      {showYearModal && <YearSelectionModal onClose={handleYearModalClose} />}

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <section className="text-center mb-14">
          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tight mb-4 leading-none">
            <span className="italic text-violet-600">MEMU</span>
            <span className="text-neutral-900">NERCHUKNNAVI</span>
          </h1>
          <p className="text-2xl text-neutral-500 font-medium mb-2 tracking-wide">
            మేము నేర్చుకున్నవి
          </p>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            "What we learned" — A collective wisdom hub for college students to help each other grow.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-2 px-7 py-3.5 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 transition-all duration-200 text-base"
              style={{ boxShadow: '0 4px 20px oklch(0.52 0.22 270 / 0.25)' }}
            >
              Explore Lessons <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate({ to: '/share' })}
              className="flex items-center gap-2 px-7 py-3.5 bg-white text-neutral-900 font-bold rounded-2xl border border-neutral-200 hover:bg-neutral-50 transition-all duration-200 text-base"
              style={{ boxShadow: '0 1px 4px oklch(0 0 0 / 0.06), 0 4px 16px oklch(0 0 0 / 0.04)' }}
            >
              Share Advice ✨
            </button>
          </div>

          {/* Year personalization banner */}
          {!hasSelected ? (
            <button
              className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 bg-violet-50 border border-violet-200 rounded-full text-sm text-violet-700 cursor-pointer hover:bg-violet-100 hover:border-violet-300 transition-all duration-200 font-medium"
              onClick={() => setShowYearModal(true)}
            >
              <GraduationCap size={15} />
              <span>Personalize for your college year</span>
              <span className="text-violet-400">→</span>
            </button>
          ) : (
            <button
              className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-full text-sm cursor-pointer hover:bg-violet-700 transition-all duration-200 font-semibold shadow-sm"
              onClick={() => setShowYearModal(true)}
              style={{ boxShadow: '0 2px 12px oklch(0.52 0.22 270 / 0.3)' }}
            >
              <span>{YEAR_EMOJIS[year!] ?? '🎓'}</span>
              <span>{year}</span>
              <span className="opacity-75 text-xs border-l border-white/30 pl-2">Change Year</span>
            </button>
          )}
        </section>

        {/* Share website */}
        <div className="flex justify-center mb-10">
          <ShareWebsiteButtons />
        </div>

        {/* Category filter */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  activeCategory === key
                    ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Year filter indicator */}
        {hasSelected && year && (
          <div className="mb-5 flex items-center justify-between px-1">
            <p className="text-sm text-neutral-500">
              Showing posts for{' '}
              <span className="font-semibold text-violet-600">{year}</span>
              {' '}students
            </p>
            <button
              onClick={() => setShowYearModal(true)}
              className="text-xs text-violet-500 hover:text-violet-700 font-medium underline underline-offset-2 transition-colors"
            >
              Change year
            </button>
          </div>
        )}

        {/* Posts grid */}
        <section>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-5 animate-pulse">
                  <div className="h-4 bg-neutral-100 rounded-full w-1/3 mb-3" />
                  <div className="h-3 bg-neutral-100 rounded-full w-full mb-2" />
                  <div className="h-3 bg-neutral-100 rounded-full w-4/5" />
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">📚</div>
              <p className="text-neutral-500 font-medium">No posts yet in this category.</p>
              <p className="text-neutral-400 text-sm mt-1">Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPosts.map((post) => (
                <PostCard key={String(post.id)} post={post} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
