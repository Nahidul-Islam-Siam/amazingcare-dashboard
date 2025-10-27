import { baseApi } from "@/redux/api/baseApi";

// Define SubscriptionPlan interface
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: "MONTHLY" | "YEARLY";
  active: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

// Define Response Interface
export interface GetAllSubscriptionPlansResponse {
  success: boolean;
  message: string;
  data: SubscriptionPlan[]; // Direct array in data
}

// Create API slice
export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Corrected: Get all subscription plans
    getAllSubscriptionPlans: build.query<GetAllSubscriptionPlansResponse, { page?: number; limit?: number }>({
      query: ({ page, limit }) => ({
        url: `/subscriptionPlan/all`,
        method: "GET",
        params: { page, limit }, // Optional pagination if backend supports it
      }),
    }),
  }),
});

// ✅ Export correct hook
export const { useGetAllSubscriptionPlansQuery } = subscriptionApi;