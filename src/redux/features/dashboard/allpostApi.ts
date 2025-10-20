// src/redux/features/dashboard/postApi.ts
import { baseApi } from "@/redux/api/baseApi";


/**
 * User information (used in both post owner and commenters)
 */
export interface PostUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  profileImage: string | null;
}

/**
 * Like on a memory/post
 */
export interface MemoryLike {
  id: string;
  userId: string;
  memoryId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Comment on a memory/post, including the author's user info
 */
export interface MemoryComment {
  id: string;
  content: string;
  userId: string;
  memoryId: string;
  createdAt: string;
  updatedAt: string;
  user: PostUser; // Matches the nested user object in comments
}

/**
 * The main post/memory object
 */
export interface MemoryPost {
  id: string;
  image: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: PostUser;
  MemoryLike: MemoryLike[];
  Comment: MemoryComment[];
}

/**
 * Pagination metadata
 */
export interface PostMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Structure of the nested 'data' field in the response
 */
export interface PostsData {
  meta: PostMeta;
  data: MemoryPost[];
}

/**
 * Full API response structure
 */
export interface GetPostsResponse {
  success: boolean;
  message: string;
  data: PostsData; // ✅ Fixed: named property with correct type
}

/**
 * Query parameters for filtering/sorting posts
 */
export interface PostQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string; // e.g. "createdAt"
  sortOrder?: "asc" | "desc";
  search?: string; // Search term for user or description
}


// 🔽 Response for delete operation
export interface DeletePostResponse {
  success: boolean;
  message: string;
}

// === API Endpoints ===
export const postApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ✅ GET all posts
    getAllPosts: build.query<GetPostsResponse, PostQueryParams | void>({
      query: (params) => ({
        url: "/posts",
        method: "GET",
        params: params ?? {},
      }),
      providesTags: ["Post"],
    }),

    // 🚫 DELETE post by ID
    deletePostById: build.mutation<DeletePostResponse, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      // ⬇️ On success, invalidate 'Post' tag to re-fetch list
      invalidatesTags: ["Post"],
    }),
  }),
});

// === Export Hooks ===
export const { useGetAllPostsQuery, useDeletePostByIdMutation } = postApi;