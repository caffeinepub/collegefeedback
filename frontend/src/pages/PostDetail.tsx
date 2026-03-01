import { useParams } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, ThumbsUp, UserPlus, Clock, GraduationCap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { useGetPost } from '../hooks/useQueries';
import { categoryConfig, formatTimeAgo } from '../components/PostCard';
import { Category } from '../backend';
import ShareButtons from '../components/ShareButtons';
import { useLanguage } from '../contexts/LanguageContext';
import { playBubblePop } from '../utils/sounds';

export default function PostDetail() {
  const { id } = useParams({ from: '/post/$id' });
  const postId = BigInt(id);
  const { t } = useLanguage();

  const { data: post, isLoading, isError } = useGetPost(postId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-10">
        <Skeleton className="h-5 w-24 mb-6" />
        <Skeleton className="h-8 w-48 mb-4 rounded-full" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-8" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-20 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="font-heading font-extrabold text-2xl text-foreground mb-2">Post not found</h2>
        <p className="text-muted-foreground font-body mb-6">
          This post may have been removed or the link is incorrect.
        </p>
        <Link to="/">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading font-bold rounded-full">
            ← Back to Feed
          </Button>
        </Link>
      </div>
    );
  }

  const catConfig = categoryConfig[post.category];
  const catLabel = post.category === Category.internships ? t('catInternships')
    : post.category === Category.hackathons ? t('catHackathons')
    : post.category === Category.courses ? t('catCourses')
    : t('catGeneral');

  const postUrl = window.location.href;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-10">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors font-body"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('backToFeed')}
      </Link>

      {/* Post card */}
      <Card className="border border-border shadow-card mb-6">
        <CardContent className="pt-8 pb-8 px-8">
          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-heading font-bold px-3 py-1.5 rounded-full border ${catConfig.className}`}
            >
              <span className="text-base">{catConfig.emoji}</span>
              {catLabel}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground font-body">
              <Clock className="w-4 h-4" />
              {formatTimeAgo(post.createdAt)}
            </span>
          </div>

          {/* Full content */}
          <p className="text-base text-foreground leading-relaxed font-body whitespace-pre-wrap mb-8">
            {post.content}
          </p>

          {/* Author */}
          <div className="flex items-center gap-3 pb-6 border-b border-border/50 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-heading font-bold text-foreground">{post.authorYear}</p>
              <p className="text-xs text-muted-foreground font-body">{t('sharedAnonymously')}</p>
            </div>
          </div>

          {/* Stats display — clickable to trigger sound */}
          <div className="flex items-center gap-3 flex-wrap mb-6">
            <button
              onClick={() => playBubblePop()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/40 font-heading font-bold text-sm text-muted-foreground hover:bg-muted/70 transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              {Number(post.connectCount)} {Number(post.connectCount) === 1 ? t('connection') : t('connections')} 🤝
            </button>
            <button
              onClick={() => playBubblePop()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/40 font-heading font-bold text-sm text-muted-foreground hover:bg-muted/70 transition-colors cursor-pointer"
            >
              <ThumbsUp className="w-4 h-4" />
              {Number(post.upvotes)} {Number(post.upvotes) === 1 ? t('upvote') : t('upvotes')} 👍
            </button>
          </div>

          {/* Share bar */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground font-heading font-bold mb-2">Share this post:</p>
            <ShareButtons postId={id} postContent={post.content} postUrl={postUrl} />
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="rounded-3xl bg-primary/8 border border-primary/20 px-8 py-8 text-center">
        <div className="text-4xl mb-3">✍️</div>
        <h3 className="font-heading font-extrabold text-xl text-foreground mb-2">
          {t('shareYourWisdom')}
        </h3>
        <p className="text-muted-foreground font-body text-sm mb-5 max-w-sm mx-auto">
          {t('shareWisdomDesc')}
        </p>
        <Link to="/share">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading font-bold gap-2 rounded-full">
            <Sparkles className="w-4 h-4" />
            {t('shareExpBtnFull')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
