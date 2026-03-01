import { Clock, GraduationCap, ThumbsUp, UserPlus } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { type Post, Category } from '../backend';
import ShareButtons from './ShareButtons';
import { useLanguage } from '../contexts/LanguageContext';

interface PostCardProps {
  post: Post;
}

export const categoryConfig: Record<Category, { label: string; emoji: string; className: string }> = {
  [Category.internships]: {
    label: 'Internships',
    emoji: '💼',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  [Category.hackathons]: {
    label: 'Hackathons',
    emoji: '💡',
    className: 'bg-accent/10 text-accent border-accent/20',
  },
  [Category.courses]: {
    label: 'Courses',
    emoji: '📚',
    className: 'bg-secondary text-secondary-foreground border-border',
  },
  [Category.general]: {
    label: 'General Tips',
    emoji: '🎓',
    className: 'bg-muted text-muted-foreground border-border',
  },
};

export function formatTimeAgo(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / BigInt(1_000_000));
  const now = Date.now();
  const diff = now - ms;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

export default function PostCard({ post }: PostCardProps) {
  const { t } = useLanguage();
  const catConfig = categoryConfig[post.category];
  const snippet = post.content.length > 160
    ? post.content.slice(0, 160).trimEnd() + '…'
    : post.content;

  const catLabel = post.category === Category.internships ? t('catInternships')
    : post.category === Category.hackathons ? t('catHackathons')
    : post.category === Category.courses ? t('catCourses')
    : t('catGeneral');

  const postUrl = `${window.location.origin}/post/${String(post.id)}`;

  return (
    <div className="block h-full">
      <Card className="group flex flex-col h-full border border-border shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 bg-card animate-fade-in">
        <Link to="/post/$id" params={{ id: String(post.id) }} className="flex-1 flex flex-col cursor-pointer">
          <CardContent className="flex-1 pt-5 pb-3 px-5">
            {/* Category badge + time */}
            <div className="flex items-center justify-between mb-3">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-heading font-bold px-2.5 py-1 rounded-full border ${catConfig.className}`}
              >
                <span>{catConfig.emoji}</span>
                {catLabel}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(post.createdAt)}
              </span>
            </div>

            {/* Content snippet */}
            <p className="text-sm text-foreground leading-relaxed font-body">
              {snippet}
            </p>
          </CardContent>

          <CardFooter className="px-5 pb-3 pt-2 flex items-center justify-between border-t border-border/50 mt-2">
            {/* Author year */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                <GraduationCap className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-xs font-heading font-bold text-foreground">
                {post.authorYear}
              </span>
            </div>

            {/* Stats (read-only display) */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-heading font-bold px-2.5 py-1 rounded-full bg-muted/60">
                <UserPlus className="w-3 h-3" />
                {Number(post.connectCount)}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-heading font-bold px-2.5 py-1 rounded-full bg-muted/60">
                <ThumbsUp className="w-3 h-3" />
                {Number(post.upvotes)}
              </span>
            </div>
          </CardFooter>
        </Link>

        {/* Share buttons */}
        <div className="px-5 pb-4 pt-1 border-t border-border/30">
          <ShareButtons postId={String(post.id)} postContent={post.content} postUrl={postUrl} compact />
        </div>
      </Card>
    </div>
  );
}
