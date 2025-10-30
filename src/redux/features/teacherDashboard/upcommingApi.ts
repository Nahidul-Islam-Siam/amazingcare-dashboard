 
import { baseApi } from "@/redux/api/baseApi";

// Define Interfaces Based on API Response
export interface UpcomingLiveSession {
  id: string;
  teacherId: string;
  title: string;
  imageurl: string;
  meetingLink: string;
  date: string; 
  time: string; 
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  upcomingLiveStatus: "PENDING" | "APPROVED" | "REJECTED";
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  totalPrice: number;
  createdAt: string; 
  updatedAt: string; 
}

export interface UpcomingLiveSessionResponse {
  success: boolean;
  message: string;
  data: UpcomingLiveSession;
}

export interface GetAllUpcomingLiveSessionsResponse {
  success: boolean;
  message: string;
  data: UpcomingLiveSession[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Payload for creating a session
export interface CreateUpcomingLiveSessionPayload {
  data: string; // JSON string of session info (title, date, time, etc.)
  image: File;  // Image file to upload
}

// Enhanced base API with endpoints
export const upCommingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Query: Get all upcoming live sessions with pagination
    getUpCommingLives: build.query<GetAllUpcomingLiveSessionsResponse, { page?: number; limit?: number }>({
      query: ({ page, limit }) => ({
        url: `/upcomingLiveSessions/allSessions`,
        method: "GET",
        params: { page, limit },
      }),
    }),

    // Mutation: Add a new upcoming live session with form data
    addUpCommingLives: build.mutation<UpcomingLiveSessionResponse, CreateUpcomingLiveSessionPayload>({
      query: (payload) => {
        const formData = new FormData();
        formData.append("data", payload.data);
        formData.append("image", payload.image);

        return {
          url: `/upcomingLiveSessions/create-session`,
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

// Export hooks for use in components
export const { useGetUpCommingLivesQuery, useAddUpCommingLivesMutation } = upCommingApi;