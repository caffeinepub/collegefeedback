import { useCallback } from 'react';
import { useGetWishlist, useAddToWishlist, useRemoveFromWishlist } from './useQueries';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function useWishlistSession(): string {
  let sessionKey = sessionStorage.getItem('wishlist_session_key');
  if (!sessionKey) {
    sessionKey = generateUUID();
    sessionStorage.setItem('wishlist_session_key', sessionKey);
  }
  return sessionKey;
}

export function useWishlistState(postId: bigint) {
  const sessionKey = useWishlistSession();
  const { data: wishlistIds = [] } = useGetWishlist(sessionKey);
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();

  const isSaved = wishlistIds.some((id) => id === postId);

  const toggleWishlist = useCallback(() => {
    if (isSaved) {
      removeMutation.mutate({ sessionKey, postId });
    } else {
      addMutation.mutate({ sessionKey, postId });
    }
  }, [isSaved, sessionKey, postId, addMutation, removeMutation]);

  const isLoading = addMutation.isPending || removeMutation.isPending;

  return { isSaved, toggleWishlist, isLoading };
}
