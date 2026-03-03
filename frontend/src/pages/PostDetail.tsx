import React from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, ThumbsUp, Link2, Bookmark, BookmarkCheck, Tag, Calendar } from 'lucide-react';
import { useGetAllPosts } from '../hooks/useQueries';
import { useWishlistState } from '../hooks/useWishlist';
import { useToast } from '../hooks/useToast';
import { playBubblePop } from '../utils/sounds';
import { Category } from '../backend';
import ShareButtons from '../components/ShareButtons';

const CATEGORY_LABELS: Record<string, string> = {
  [Category.internships]: 'Internships',
  [Category.hackathons]: 'Hackathons',
  [Category.courses]: 'Courses',
  [Category.general]: 'General',
};

const CATEGORY_STYLES: Record<string, string> = {
  [Category.internships]: 'bg-violet-100 text-violet-700 border-violet-200',
  [Category.hackathons]: 'bg-violet-50 text-violet-600 border-violet-100',
  [Category.courses]: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  [Category.general]: 'bg-neutral-50 text-neutral-500 border-neutral-100',
};

export default function PostDetail() {
  const { id } = useParams({ from: '/post/$id' });
  const navigate = useNavigate();
  const { data: posts, isLoading } = useGetAllPosts();
  const post = posts?.find((p) => String(p.id) === id);
  const { isSaved, toggleWishlist, isLoading: wishlistLoading } = useWishlistState(post?.id ?? BigInt(0));
  const { showToast } = useToast();

  const handleBookmark = () => {
    playBubblePop();
    const willSave = !isSaved;
    toggleWishlist();
    showToast(willSave ? 'Added to saved ✓' : 'Removed from saved', willSave ? 'success' : 'info');
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 animate-pulse">
          <div className="h-6 bg-neutral-100 rounded-full w-1/3 mb-4" />
          <div className="h-4 bg-neutral-100 rounded-full w-full mb-2" />
          <div className="h-4 bg-neutral-100 rounded-full w-4/5 mb-2" />
          <div className="h-4 bg-neutral-100 rounded-full w-3/5" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-neutral-500 font-medium">Post not found.</p>
        <button
          onClick={() => navigate({ to: '/' })}
          className="mt-4 px-5 py-2 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const catStyle = CATEGORY_STYLES[post.category as string] ?? 'bg-neutral-100 text-neutral-600 border-neutral-200';
  const catLabel = CATEGORY_LABELS[post.category as string] ?? String(post.category);
  const date = new Date(Number(post.createdAt) / 1_000_000);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate({ to: '/' })}
        className="flex items-center gap-2 text-neutral-500 hover:text-violet-600 mb-6 text-sm font-medium transition-colors"
      >
        <ArrowLeft size={16} /> Back to Home
      </button>

      <article className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-card">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${catStyle}`}>
              <Tag size={10} className="inline mr-1" />
              {catLabel}
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-violet-100 text-violet-700">
              {post.authorYear}
            </span>
          </div>
          <button
            onClick={handleBookmark}
            disabled={wishlistLoading}
            className={`p-2 rounded-full transition-all duration-200 ${
              isSaved
                ? 'text-violet-600 bg-violet-50 hover:bg-violet-100'
                : 'text-neutral-400 hover:text-violet-600 hover:bg-violet-50'
            }`}
          >
            {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        </div>

        {/* Content */}
        <p className="text-neutral-800 leading-relaxed text-base mb-6 whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm text-neutral-400 mb-6 pb-6 border-b border-neutral-100">
          <span className="flex items-center gap-1.5">
            <ThumbsUp size={14} className="text-violet-400" />
            {String(post.upvotes)} upvotes
          </span>
          <span className="flex items-center gap-1.5">
            <Link2 size={14} className="text-violet-400" />
            {String(post.connectCount)} connects
          </span>
          <span className="flex items-center gap-1.5 ml-auto">
            <Calendar size={14} />
            {date.toLocaleDateString()}
          </span>
        </div>

        {/* Share */}
        <ShareButtons postId={String(post.id)} content={post.content} />
      </article>
    </div>
  );
}
