import { Link } from '@tanstack/react-router';
import { BarChart2, TrendingUp, Users, BookOpen, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useGetStats, useGetAllPosts } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import { Category, type Post } from '../backend';
import { categoryConfig } from '../components/PostCard';

const categoryOrder: Category[] = [
  Category.internships,
  Category.hackathons,
  Category.courses,
  Category.general,
];

function StatCard({ emoji, label, value, sub }: { emoji: string; label: string; value: string | number; sub?: string }) {
  return (
    <Card className="border border-border shadow-card">
      <CardContent className="pt-6 pb-6 px-6 flex flex-col gap-1">
        <div className="text-3xl mb-1">{emoji}</div>
        <div className="font-heading font-bold text-3xl text-foreground">{value}</div>
        <div className="font-heading font-semibold text-sm text-foreground">{label}</div>
        {sub && <div className="text-xs text-muted-foreground font-body">{sub}</div>}
      </CardContent>
    </Card>
  );
}

function TopPostsList({ posts, label, countKey }: { posts: Post[]; label: string; countKey: 'upvotes' | 'connectCount' }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-sm text-muted-foreground font-body py-4 text-center">
        No posts yet 🌱
      </div>
    );
  }
  return (
    <ul className="space-y-3">
      {posts.map((post, i) => {
        const cat = categoryConfig[post.category];
        if (!cat) return null;
        const snippet = post.content.length > 80
          ? post.content.slice(0, 80).trimEnd() + '…'
          : post.content;
        const count = Number(post[countKey]);
        return (
          <li key={String(post.id)}>
            <Link to="/post/$id" params={{ id: String(post.id) }} className="block">
              <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                <span className="font-heading font-bold text-lg text-primary/60 w-6 flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`inline-flex items-center gap-1 text-xs font-heading font-semibold px-2 py-0.5 rounded-full border ${cat.className}`}>
                      {cat.emoji} {cat.label}
                    </span>
                    <span className="text-xs text-muted-foreground font-body">{post.authorYear}</span>
                  </div>
                  <p className="text-sm text-foreground font-body leading-snug">{snippet}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="font-heading font-bold text-primary text-sm">{count}</div>
                  <div className="text-xs text-muted-foreground font-body">{label}</div>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function YearDistribution({ posts }: { posts: Post[] }) {
  const yearCounts: Record<string, number> = {};
  (posts ?? []).forEach(p => {
    yearCounts[p.authorYear] = (yearCounts[p.authorYear] ?? 0) + 1;
  });

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const max = Math.max(...Object.values(yearCounts), 1);

  const yearEmojis: Record<string, string> = {
    '1st Year': '🌱',
    '2nd Year': '📖',
    '3rd Year': '🚀',
    '4th Year': '🎓',
  };

  return (
    <div className="space-y-3">
      {years.map(yr => {
        const count = yearCounts[yr] ?? 0;
        const pct = Math.round((count / max) * 100);
        return (
          <div key={yr} className="flex items-center gap-3">
            <span className="text-lg w-6">{yearEmojis[yr]}</span>
            <span className="font-heading font-semibold text-sm text-foreground w-20 flex-shrink-0">{yr}</span>
            <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="font-heading font-bold text-sm text-primary w-8 text-right">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-10">
      <Skeleton className="h-6 w-32 mb-3 rounded-full" />
      <Skeleton className="h-10 w-72 mb-2" />
      <Skeleton className="h-5 w-80 mb-10" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-48 rounded-xl mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
      <Skeleton className="h-40 rounded-xl" />
    </div>
  );
}

export default function Dashboard() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: stats, isLoading: statsLoading, isError: statsError, error: statsErrorObj } = useGetStats();
  const { data: allPosts, isLoading: postsLoading, isError: postsError } = useGetAllPosts();

  // Show loading while actor is initializing OR while queries are in flight
  const isLoading = actorFetching || !actor || statsLoading || postsLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (statsError || postsError) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-20">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-heading font-bold">Failed to load dashboard</AlertTitle>
          <AlertDescription className="font-body">
            {statsErrorObj instanceof Error
              ? statsErrorObj.message
              : 'Could not fetch community stats. Please refresh the page and try again.'}
          </AlertDescription>
        </Alert>
        <div className="text-center mt-8">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-heading font-semibold px-6 py-2.5 rounded-full transition-colors shadow-sm"
          >
            🔄 Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Safe defaults for all data
  const totalPosts = stats ? Number(stats.totalPosts) : 0;
  const categoryCounts = stats?.categoryCounts ?? [];
  const topUpvoted = stats?.topUpvotedPosts ?? [];
  const topConnected = stats?.topConnectedPosts ?? [];
  const safeAllPosts = allPosts ?? [];

  // Build category count map
  const catCountMap: Record<string, number> = {};
  categoryCounts.forEach(([cat, count]) => {
    catCountMap[cat as string] = Number(count);
  });

  const maxCatCount = Math.max(...categoryOrder.map(c => catCountMap[c] ?? 0), 1);

  // Total unique contributors (unique authorYears is a proxy)
  const uniqueYears = new Set(safeAllPosts.map(p => p.authorYear)).size;
  const totalUpvotes = safeAllPosts.reduce((sum, p) => sum + Number(p.upvotes), 0);
  const totalConnects = safeAllPosts.reduce((sum, p) => sum + Number(p.connectCount), 0);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-10">
      {/* Page header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-heading font-semibold px-3 py-1.5 rounded-full mb-3">
          <BarChart2 className="w-3.5 h-3.5" />
          Live stats
        </div>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-2">
          📊 Community Dashboard
        </h1>
        <p className="text-muted-foreground font-body text-base">
          See how the SeniorCompass community is growing and what's resonating most.
        </p>
      </div>

      {/* Hero stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatCard emoji="📝" label="Total Posts" value={totalPosts} sub="Shared by students" />
        <StatCard emoji="👍" label="Total Upvotes" value={totalUpvotes} sub="Helpful votes" />
        <StatCard emoji="🤝" label="Connections" value={totalConnects} sub="Students connected" />
        <StatCard emoji="🎓" label="Year Groups" value={uniqueYears} sub="Active year groups" />
      </div>

      {/* Category breakdown */}
      <Card className="border border-border shadow-card mb-8">
        <CardHeader className="pb-2 pt-6 px-6">
          <h2 className="font-heading font-bold text-xl text-foreground">📂 Posts by Category</h2>
          <p className="text-sm text-muted-foreground font-body">How wisdom is distributed across topics</p>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {totalPosts === 0 ? (
            <div className="text-center py-8 text-muted-foreground font-body">
              <div className="text-4xl mb-2">🌱</div>
              <p>No posts yet — be the first to share!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryOrder.map(cat => {
                const cfg = categoryConfig[cat];
                if (!cfg) return null;
                const count = catCountMap[cat] ?? 0;
                const pct = Math.round((count / maxCatCount) * 100);
                return (
                  <div key={cat} className={`rounded-xl border p-4 ${cfg.className}`}>
                    <div className="text-3xl mb-2">{cfg.emoji}</div>
                    <div className="font-heading font-bold text-2xl mb-0.5">{count}</div>
                    <div className="font-heading font-semibold text-sm mb-3">{cfg.label}</div>
                    <div className="bg-black/10 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-current rounded-full opacity-60 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border border-border shadow-card">
          <CardHeader className="pb-2 pt-6 px-6">
            <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Top Upvoted Posts 👍
            </h2>
            <p className="text-xs text-muted-foreground font-body">Most helpful advice from the community</p>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <TopPostsList posts={topUpvoted} label="upvotes" countKey="upvotes" />
          </CardContent>
        </Card>

        <Card className="border border-border shadow-card">
          <CardHeader className="pb-2 pt-6 px-6">
            <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Most Connected Posts 🤝
            </h2>
            <p className="text-xs text-muted-foreground font-body">Posts that sparked the most connections</p>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <TopPostsList posts={topConnected} label="connects" countKey="connectCount" />
          </CardContent>
        </Card>
      </div>

      {/* Year distribution */}
      {safeAllPosts.length > 0 && (
        <Card className="border border-border shadow-card mb-8">
          <CardHeader className="pb-2 pt-6 px-6">
            <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Posts by Year Group 🎓
            </h2>
            <p className="text-xs text-muted-foreground font-body">Which year groups are sharing the most</p>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <YearDistribution posts={safeAllPosts} />
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <div className="rounded-2xl bg-primary/8 border border-primary/20 px-8 py-8 text-center">
        <div className="text-4xl mb-3">🚀</div>
        <h3 className="font-heading font-bold text-xl text-foreground mb-2">
          Add your wisdom to the mix!
        </h3>
        <p className="text-muted-foreground font-body text-sm mb-5 max-w-sm mx-auto">
          Every post you share helps a fellow student navigate campus life better.
        </p>
        <Link to="/share">
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-heading font-semibold px-6 py-2.5 rounded-full transition-colors shadow-sm">
            ✍️ Share Your Experience
          </button>
        </Link>
      </div>
    </div>
  );
}
