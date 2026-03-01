import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Category, type Post, type PostStats } from '../backend';

export function useGetAllPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['posts', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      const posts = await actor.getAllPosts();
      // Sort newest first
      return [...posts].sort((a, b) => Number(b.createdAt - a.createdAt));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPostsByCategory(category: Category) {
  const { actor, isFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['posts', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      const posts = await actor.getPostsByCategory(category);
      return [...posts].sort((a, b) => Number(b.createdAt - a.createdAt));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPost(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Post | null>({
    queryKey: ['posts', 'single', String(id)],
    queryFn: async () => {
      if (!actor) return null;
      const posts = await actor.getAllPosts();
      return posts.find(p => p.id === id) ?? null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStats() {
  const { actor, isFetching } = useActor();

  return useQuery<PostStats>({
    queryKey: ['stats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      content: string;
      authorYear: string;
      category: Category;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createPost(
        params.content,
        params.authorYear,
        params.category,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}
