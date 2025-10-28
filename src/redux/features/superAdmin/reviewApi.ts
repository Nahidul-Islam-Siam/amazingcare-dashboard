import { baseApi } from "@/redux/api/baseApi";

// Define User (minimal version from review)
export interface ReviewUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  // Other fields omitted for clarity
}

// Define App Review
export interface AppReview {
  id: string;
  userId: string;
  rating: number; // 1-5
  comment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
}

// Response Interface
export interface GetPendingReviewsResponse {
  success: boolean;
  message: string;
  data: AppReview[]; // Array of reviews
}

// API Slice
export const reviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ✅ Correct: Fetch pending reviews
    getPendingReviews: build.query<GetPendingReviewsResponse, void>({
      query: () => ({
        url: "/appReviews/admin/pending",
        method: "GET",
      }),
      providesTags: ["Review"], // For cache invalidation
    }),

    // Optional: Approve or reject a review
// In: src/redux/features/superAdmin/reviewApi.ts

approveReview: build.mutation<{ success: boolean; message: string }, string>({
  query: (id) => ({
    url: `/appReviews/admin/${id}/approve`,
    method: "PUT",
  }),
  invalidatesTags: ["Review"],
}),

rejectReview: build.mutation<{ success: boolean; message: string }, string>({
  query: (id) => ({
    url: `/appReviews/admin/${id}/reject`,
    method: "PUT",
  }),
  invalidatesTags: ["Review"],
}),


  }),
});

// ✅ Export correct hooks
export const { 
  useGetPendingReviewsQuery,
  useApproveReviewMutation,
  useRejectReviewMutation 
} = reviewApi;