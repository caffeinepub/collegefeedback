import { useState } from 'react';
import { Sparkles, Flame } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import PostCard from '../components/PostCard';
import { categoryConfig } from '../components/PostCard';
import { useGetAllPosts, useGetPostsByCategory } from '../hooks/useQueries';
import { Category, type Post } from '../backend';
import { useLanguage } from '../contexts/LanguageContext';
import { playBubblePop } from '../utils/sounds';

type FilterTab = 'all' | Category;

function PostSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 flex flex-col gap-3">
      <div className="flex justify-between">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
      <div className="flex justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
    </div>
  );
}

function TrendingSection({ posts }: { posts: Post[] }) {
  const { t } = useLanguage();
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const trending = posts
    .filter(p => Number(p.createdAt / BigInt(1_000_000)) >= oneWeekAgo)
    .sort((a, b) => Number(b.upvotes - a.upvotes))
    .slice(0, 3);

  const getCatLabel = (cat: Category) => {
    if (cat === Category.internships) return t('catInternships');
    if (cat === Category.hackathons) return t('catHackathons');
    if (cat === Category.courses) return t('catCourses');
    return t('catGeneral');
  };

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-primary" />
        <h2 className="font-heading font-extrabold text-lg text-foreground">{t('trendingTitle')}</h2>
      </div>
      {trending.length === 0 ? (
        <div className="rounded-2xl border border-border bg-primary/5 px-5 py-4 text-sm text-muted-foreground font-body">
          {t('trendingEmpty')}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {trending.map(post => {
            const cat = categoryConfig[post.category];
            const snippet = post.content.length > 80
              ? post.content.slice(0, 80).trimEnd() + '…'
              : post.content;
            return (
              <Link
                key={String(post.id)}
                to="/post/$id"
                params={{ id: String(post.id) }}
                className="block"
              >
                <div className="rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors p-4 h-full">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-base">{cat.emoji}</span>
                    <span className="text-xs font-heading font-bold text-primary">{getCatLabel(post.category)}</span>
                  </div>
                  <p className="text-sm text-foreground font-body leading-relaxed line-clamp-3">{snippet}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground font-heading font-bold">
                    <span>👍 {Number(post.upvotes)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

// Separate component to call useGetPostsByCategory only when a real Category is selected
function CategoryPosts({ category }: { category: Category }) {
  const { data, isLoading, isError } = useGetPostsByCategory(category);
  return { data: data ?? [], isLoading, isError };
}

export default function Home() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const allPostsQuery = useGetAllPosts();
  // Only call category query when a real category is selected
  const categoryQuery = useGetPostsByCategory(
    (activeTab !== 'all' ? activeTab : Category.general) as Category
  );

  const isLoading = activeTab === 'all' ? allPostsQuery.isLoading : categoryQuery.isLoading;
  const isError = activeTab === 'all' ? allPostsQuery.isError : categoryQuery.isError;
  const posts: Post[] = activeTab === 'all'
    ? (allPostsQuery.data ?? [])
    : (categoryQuery.data ?? []);

  const allPosts: Post[] = allPostsQuery.data ?? [];

  const tabs: { key: FilterTab; label: string; emoji: string }[] = [
    { key: 'all', label: t('catAll'), emoji: '✨' },
    { key: Category.internships, label: t('catInternships'), emoji: '💼' },
    { key: Category.hackathons, label: t('catHackathons'), emoji: '💡' },
    { key: Category.courses, label: t('catCourses'), emoji: '📚' },
    { key: Category.general, label: t('catGeneral'), emoji: '🎓' },
  ];

  const handleTabClick = (key: FilterTab) => {
    setActiveTab(key);
    playBubblePop();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-8">
      {/* Hero */}
      <section className="mb-10">
        <div className="rounded-3xl overflow-hidden relative">
          <img
            src="/assets/generated/hero-pastel.dim_1200x400.png"
            alt="Hero"
            className="w-full h-48 sm:h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-accent/40 flex flex-col justify-center px-8 sm:px-12">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-heading font-bold px-3 py-1.5 rounded-full mb-3 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              {t('heroBadge')}
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white mb-2 leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-white/85 font-body text-sm sm:text-base max-w-md">
              {t('heroSubtitle')}
            </p>
            <div className="mt-4">
              <Link to="/share">
                <Button
                  size="sm"
                  className="bg-white text-primary hover:bg-white/90 font-heading font-bold rounded-full shadow-sm"
                >
                  {t('heroBtn')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending */}
      {allPosts.length > 0 && <TrendingSection posts={allPosts} />}

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-heading font-bold transition-all duration-150
              ${activeTab === tab.key
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
          >
            <span>{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <PostSkeleton key={i} />)}
        </div>
      ) : isError ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">😕</div>
          <p className="text-muted-foreground font-body">{t('failedLoad')}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="font-heading font-extrabold text-xl text-foreground mb-2">{t('noPostsTitle')}</h3>
          <p className="text-muted-foreground font-body mb-6">{t('noPostsDesc')}</p>
          <Link to="/share">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading font-bold rounded-full">
              {t('shareExpBtn')}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map(post => (
            <PostCard key={String(post.id)} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
