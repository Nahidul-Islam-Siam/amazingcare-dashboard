import { baseApi } from "@/redux/api/baseApi";

/** === Interfaces aligned to /subscription/plan API === */
export interface SubscriptionFeature {
  key: string;
  value: string | number;
  isActive: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price?: number;
  currency?: string; // e.g., "USD"
  interval?: "DAY" | "WEEK" | "MONTH" | "YEAR"; // backend uses MONTH
  subtitle?: string | null;
  discount?: string | null;
  trialDays?: number;
  active?: boolean;
  features: SubscriptionFeature[];
  createdAt: string;
}

export interface GetSubscriptionsResponse {
  success: boolean;
  message: string;
  data: SubscriptionPlan[];
}

export interface AddSubscriptionResponse {
  success: boolean;
  message: string;
  data: SubscriptionPlan;
}

export interface DeleteSubscriptionResponse {
  success: boolean;
  message: string;
}

/** === Input type for creating new plan === */
export interface CreateSubscriptionInput {
  name?: string;
  price?: number;
  currency?: string;
  interval?: "DAY" | "WEEK" | "MONTH" | "YEAR";
  subtitle?: string;
  discount?: string;
  trialDays?: number;
  active?: boolean;
  features?: SubscriptionFeature[];
}

/** === Query params for filtering === */
export interface SubscriptionQueryParams {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  interval?: string; // e.g. "MONTH"
  active?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/** === API Endpoints === */
export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ✅ GET /subscription/plan
    getSubscriptions: build.query<GetSubscriptionsResponse, SubscriptionQueryParams | void>({
      query: (params) => ({
        url: "/subscription/plan",
        method: "GET",
        params: params ?? {},
      }),
      providesTags: ["Subscriptions"],
    }),

    // ✅ DELETE /subscription/plan/:id
    deleteSubscription: build.mutation<DeleteSubscriptionResponse, string>({
      query: (id) => ({
        url: `/subscription/plan/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscriptions"],
    }),

    // ✅ POST /subscription/plan (create)
    addSubscription: build.mutation<AddSubscriptionResponse, CreateSubscriptionInput>({
      query: (body) => ({
        url: "/subscription/plan",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subscriptions"],
    }),
  }),
});

/** === Hooks === */
export const {
  useGetSubscriptionsQuery,
  useAddSubscriptionMutation,
  useDeleteSubscriptionMutation,
} = subscriptionApi;
