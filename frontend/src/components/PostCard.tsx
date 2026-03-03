import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Bookmark, BookmarkCheck, ThumbsUp, Link2, Tag } from 'lucide-react';
import { Post, Category } from '../backend';
import { useWishlistState } from '../hooks/useWishlist';
import { useToast } from '../hooks/useToast';
import { playBubblePop } from '../utils/sounds';

interface PostCardProps {
  post: Post;
}

const CATEGORY_STYLES: Record<string, { label: string; className: string }> = {
  [Category.internships]: {
    label: 'Internships',
    className: 'bg-violet-100 text-violet-700 border-violet-200',
  },
  [Category.hackathons]: {
    label: 'Hackathons',
    className: 'bg-violet-50 text-violet-600 border-violet-100',
  },
  [Category.courses]: {
    label: 'Courses',
    className: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  },
  [Category.general]: {
    label: 'General',
    className: 'bg-neutral-50 text-neutral-500 border-neutral-100',
  },
};

const YEAR_COLORS: Record<string, string> = {
  '1st Year': 'bg-violet-100 text-violet-700',
  '2nd Year': 'bg-violet-200 text-violet-800',
  '3rd Year': 'bg-neutral-100 text-neutral-700',
  '4th Year': 'bg-neutral-200 text-neutral-800',
};

export default function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();
  const { isSaved, toggleWishlist, isLoading } = useWishlistState(post.id);
  const { showToast } = useToast();

  const catStyle = CATEGORY_STYLES[post.category as string] ?? {
    label: String(post.category),
    className: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  };

  const yearColor = YEAR_COLORS[post.authorYear] ?? 'bg-neutral-100 text-neutral-600';

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    playBubblePop();
    const willSave = !isSaved;
    toggleWishlist();
    showToast(
      willSave ? 'Added to saved ✓' : 'Removed from saved',
      willSave ? 'success' : 'info'
    );
  };

  return (
    <article
      className="bg-white rounded-2xl border border-neutral-200 p-5 cursor-pointer hover:border-violet-300 hover:shadow-card transition-all duration-200 group"
      onClick={() => navigate({ to: '/post/$id', params: { id: String(post.id) } })}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${catStyle.className}`}>
            <Tag size={10} className="inline mr-1" />
            {catStyle.label}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${yearColor}`}>
            {post.authorYear}
          </span>
        </div>
        <button
          onClick={handleBookmark}
          disabled={isLoading}
          className={`p-1.5 rounded-full transition-all duration-200 flex-shrink-0 ${
            isSaved
              ? 'text-violet-600 bg-violet-50 hover:bg-violet-100'
              : 'text-neutral-400 hover:text-violet-600 hover:bg-violet-50'
          }`}
          aria-label={isSaved ? 'Remove from saved' : 'Save post'}
        >
          {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </button>
      </div>

      {/* Content */}
      <p className="text-neutral-800 text-sm leading-relaxed line-clamp-3 mb-4">
        {post.content}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-4 text-xs text-neutral-400">
        <span className="flex items-center gap-1">
          <ThumbsUp size={12} />
          {String(post.upvotes)} upvotes
        </span>
        <span className="flex items-center gap-1">
          <Link2 size={12} />
          {String(post.connectCount)} connects
        </span>
        <span className="ml-auto text-violet-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Read more →
        </span>
      </div>
    </article>
  );
}
