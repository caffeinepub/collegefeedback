import React from 'react';
import { Bookmark, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllPosts, useGetWishlist } from '../hooks/useQueries';
import { useWishlistSession } from '../hooks/useWishlist';
import PostCard from '../components/PostCard';

export default function Wishlist() {
  const navigate = useNavigate();
  const sessionKey = useWishlistSession();
  const { data: wishlistIds, isLoading: wishlistLoading } = useGetWishlist(sessionKey);
  const { data: allPosts, isLoading: postsLoading } = useGetAllPosts();

  const isLoading = wishlistLoading || postsLoading;

  const savedPosts = allPosts && wishlistIds
    ? allPosts.filter((p) => wishlistIds.some((id) => id === p.id))
    : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate({ to: '/' })}
        className="flex items-center gap-2 text-neutral-500 hover:text-violet-600 mb-6 text-sm font-medium transition-colors"
      >
        <ArrowLeft size={16} /> Back to Home
      </button>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-heading font-black text-neutral-900 mb-2">
          <span className="italic text-violet-600">Saved</span> Posts
        </h1>
        <p className="text-neutral-500">Your bookmarked experiences and advice.</p>
      </div>

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
      ) : savedPosts.length === 0 ? (
        <div className="text-center py-16">
          <Bookmark size={40} className="text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-500 font-medium">No saved posts yet.</p>
          <p className="text-neutral-400 text-sm mt-1">Bookmark posts from the feed to see them here.</p>
          <button
            onClick={() => navigate({ to: '/' })}
            className="mt-4 px-5 py-2 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors"
          >
            Browse Posts
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedPosts.map((post) => (
            <PostCard key={String(post.id)} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
