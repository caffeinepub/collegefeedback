import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Category, Post, PostStats, CollegeConnect } from '../backend';

export function useGetAllPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPosts();
    },
    enabled: !!actor && !isFetching,
    retry: 10,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    refetchInterval: (query) => (!query.state.data || query.state.data.length === 0 ? 3000 : false),
  });
}

export function useGetPostsByCategory(category: Category) {
  const { actor, isFetching } = useActor();
  return useQuery<Post[]>({
    queryKey: ['posts', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPostsByCategory(category);
    },
    enabled: !!actor && !isFetching,
    retry: 10,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    refetchInterval: (query) => (!query.state.data || query.state.data.length === 0 ? 3000 : false),
  });
}

export function useGetPost(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Post | null>({
    queryKey: ['post', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      const posts = await actor.getAllPosts();
      return posts.find((p) => p.id === id) ?? null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStats() {
  const { actor, isFetching } = useActor();
  return useQuery<PostStats>({
    queryKey: ['stats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      return actor.getStats();
    },
    enabled: !!actor && !isFetching,
    retry: 10,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    refetchInterval: (query) => (!query.state.data ? 3000 : false),
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      content,
      authorYear,
      category,
    }: {
      content: string;
      authorYear: string;
      category: Category;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.createPost(content, authorYear, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

// Wishlist hooks
export function useGetWishlist(sessionKey: string) {
  const { actor, isFetching } = useActor();
  return useQuery<bigint[]>({
    queryKey: ['wishlist', sessionKey],
    queryFn: async () => {
      if (!actor || !sessionKey) return [];
      return actor.getWishlist(sessionKey);
    },
    enabled: !!actor && !isFetching && !!sessionKey,
  });
}

export function useAddToWishlist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ sessionKey, postId }: { sessionKey: string; postId: bigint }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.addToWishlist(sessionKey, postId);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', variables.sessionKey] });
    },
  });
}

export function useRemoveFromWishlist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ sessionKey, postId }: { sessionKey: string; postId: bigint }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.removeFromWishlist(sessionKey, postId);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', variables.sessionKey] });
    },
  });
}

// College Connect hooks
export function useGetCollegeConnects() {
  const { actor, isFetching } = useActor();
  return useQuery<CollegeConnect[]>({
    queryKey: ['collegeConnects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCollegeConnects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitCollegeConnect() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      collegeName,
      year,
      tip,
    }: {
      collegeName: string;
      year: string;
      tip: string;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.submitCollegeConnect(collegeName, year, tip);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collegeConnects'] });
    },
  });
}
