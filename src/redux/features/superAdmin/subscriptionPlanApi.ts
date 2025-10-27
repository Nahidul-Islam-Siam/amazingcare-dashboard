import { baseApi } from "@/redux/api/baseApi";

// Define SubscriptionPlan interface
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string; // Added by server (e.g., USD)
  interval: "MONTHLY" | "YEARLY";
  active: boolean; // Default true on server
  features: string[];
  createdAt: string;
  updatedAt: string;
}

// Request type for creating a plan
export type CreateSubscriptionPlanRequest = {
  name: string;
  price: number;
  interval: "MONTHLY" | "YEARLY";
  features: string[];
};

// Response Interfaces
export interface GetAllSubscriptionPlansResponse {
  success: boolean;
  message: string;
  data: SubscriptionPlan[];
}

export interface CreateSubscriptionPlanResponse {
  success: boolean;
  message: string;
  data: SubscriptionPlan;
}

export interface DeleteSubscriptionPlanResponse {
  success: boolean;
  message: string;
}

export interface GetSingleSubscriptionPlanResponse {
  success: boolean;
  message: string;
  data: SubscriptionPlan;
}

// API Slice
export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get all subscription plans
    getAllSubscriptionPlans: build.query<GetAllSubscriptionPlansResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/subscriptionPlan/all`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["SubscriptionPlan"],
    }),

    // Create new subscription plan
    createSubscriptionPlan: build.mutation<CreateSubscriptionPlanResponse, CreateSubscriptionPlanRequest>({
      query: (newPlan) => ({
        url: `/subscriptionPlan`,
        method: "POST",
        body: newPlan,
      }),
      invalidatesTags: ["SubscriptionPlan"],
    }),

    // Delete subscription plan by ID
    deleteSubscriptionPlan: build.mutation<DeleteSubscriptionPlanResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/subscriptionPlan/plan/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubscriptionPlan"],
    }),

    // Get single subscription plan by ID
    getSingleSubscriptionPlan: build.query<GetSingleSubscriptionPlanResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/subscriptionPlan/plan/${id}`,
        method: "GET",
      }),
      providesTags: ["SubscriptionPlan"], // Optional: useful if you edit/fetch single item
    }),
  }),
});

// Export hooks
export const {
  useGetAllSubscriptionPlansQuery,
  useCreateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
  useGetSingleSubscriptionPlanQuery,
} = subscriptionApi;