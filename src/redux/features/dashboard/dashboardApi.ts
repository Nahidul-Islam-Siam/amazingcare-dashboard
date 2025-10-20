import { baseApi } from "@/redux/api/baseApi";
// src/types/dashboard.ts

export interface DashboardStats {
  totalRevenue: number;
  totalUsers: number;
  totalVisitors: number;
  newUsers: number;
  totalCoinSales: number;
  totalDatingUsers: number;
  totalSocialUsers: number;
  totalGiftCard: number;
  totalBlockedUsers: number;
  totalInactiveUsers: number;
}

export interface DashboardMeta {
  page: number;
  limit: number;
  totalUsers: number;
  totalPages: number;
}

export interface DashboardUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  profileImage: string | null;
}

export interface DashboardData {
  stats: DashboardStats;
  meta: DashboardMeta;
  data: DashboardUser[];
}

export interface GetDashboardStatsResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}


export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardStats: build.query<GetDashboardStatsResponse, void>({
      query: () => ({
        url: "/dashboard",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
