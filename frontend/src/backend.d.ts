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
export interface CollegeConnect {
    id: bigint;
    tip: string;
    collegeName: string;
    createdAt: bigint;
    year: string;
}
export interface StudentProfile {
    availableForDM: boolean;
    collegeName: string;
    name: string;
    collegeYear: string;
}
export interface DMMessage {
    recipient: string;
    sender: string;
    message: string;
    timestamp: bigint;
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
export interface ChatMessage {
    authorName: string;
    collegeYear: string;
    message: string;
    timestamp: bigint;
}
export interface FeedbackEntry {
    authorName: string;
    collegeYear: string;
    feedback: string;
    timestamp: bigint;
}
export interface UserProfile {
    collegeName: string;
    name: string;
    collegeYear: string;
}
export enum Category {
    courses = "courses",
    hackathons = "hackathons",
    internships = "internships",
    general = "general"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addToWishlist(sessionKey: string, postId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrUpdateStudentProfile(name: string, year: string, college: string, available: boolean): Promise<void>;
    createPost(content: string, authorYear: string, category: Category): Promise<bigint>;
    getAllCollegeConnects(): Promise<Array<CollegeConnect>>;
    getAllFeedbackEntries(): Promise<Array<FeedbackEntry>>;
    getAllPosts(): Promise<Array<Post>>;
    getAvailableStudents(): Promise<Array<StudentProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConversation(user1: string, user2: string): Promise<Array<DMMessage>>;
    getLatestChatMessages(limit: bigint): Promise<Array<ChatMessage>>;
    getPostsByCategory(category: Category): Promise<Array<Post>>;
    getStats(): Promise<PostStats>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWishlist(sessionKey: string): Promise<Array<bigint>>;
    isCallerAdmin(): Promise<boolean>;
    isStudentAvailableForDM(name: string): Promise<boolean>;
    postChatMessage(author: string, year: string, message: string): Promise<void>;
    removeFromWishlist(sessionKey: string, postId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendDM(sender: string, recipient: string, message: string): Promise<void>;
    submitCollegeConnect(collegeName: string, year: string, tip: string): Promise<bigint>;
    submitFeedback(author: string, year: string, feedback: string): Promise<void>;
}
