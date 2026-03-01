import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PostStats {
    categoryCounts: Array<[Category, bigint]>;
    topUpvotedPosts: Array<Post>;
    topConnectedPosts: Array<Post>;
    totalPosts: bigint;
}
export interface Post {
    id: bigint;
    upvotes: bigint;
    content: string;
    createdAt: bigint;
    authorYear: string;
    connectCount: bigint;
    category: Category;
}
export interface CollegeConnect {
    id: bigint;
    tip: string;
    collegeName: string;
    createdAt: bigint;
    year: string;
}
export enum Category {
    courses = "courses",
    hackathons = "hackathons",
    internships = "internships",
    general = "general"
}
export interface backendInterface {
    addToWishlist(sessionKey: string, postId: bigint): Promise<void>;
    createPost(content: string, authorYear: string, category: Category): Promise<bigint>;
    getAllCollegeConnects(): Promise<Array<CollegeConnect>>;
    getAllPosts(): Promise<Array<Post>>;
    getPostsByCategory(category: Category): Promise<Array<Post>>;
    getStats(): Promise<PostStats>;
    getWishlist(sessionKey: string): Promise<Array<bigint>>;
    removeFromWishlist(sessionKey: string, postId: bigint): Promise<void>;
    submitCollegeConnect(collegeName: string, year: string, tip: string): Promise<bigint>;
}
