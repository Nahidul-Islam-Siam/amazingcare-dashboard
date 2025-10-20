 
// src/redux/features/dashboard/userApi.ts
import { baseApi } from "@/redux/api/baseApi";

/** ===== Types ===== */
export interface User {
  serial: number;
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: string; // e.g. "USER"
  profileImage: string | null;
  isDatingMode: boolean;
  status: string; // e.g. "ACTIVE"
  createdAt: string; // ISO
}

export interface Meta {
  page: number;
  limit: number;
  totalUsers?: number; // in some endpoints it's "totalUsers"
  total?: number;      // in reports it's just "total"
  totalPages?: number;
}

export interface GetUsersResponse {
  success: boolean;
  message: string;
  data: {
    meta: Meta;
    data: User[];
  };
}

/** Report types (for stronger typing if needed) */
export interface ReportedUser {
  id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  reporterId: string;
  reportedUserId?: string;
  memoryId?: string;
  reportedUser?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    profileImage: string | null;
  };
  reporter?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    profileImage: string | null;
  };
}

export interface GetReportsResponse {
  success: boolean;
  message: string;
  data: {
    meta: Meta;
    data: ReportedUser[];
  };
}

/** ===== API slice ===== */
export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Get reported users */
    getUserReports: build.query<
      GetReportsResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: string;
        status?: string;
        isDating?: boolean;
      }
    >({
      query: (filters) => ({
        url: "/report/user",
        method: "GET",
        params: filters,
      }),
      providesTags: ["Reports"],
    }),

    /** Get reported posts */
    getReportsPost: build.query<
      GetReportsResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: string;
        status?: string;
        isDating?: boolean;
      }
    >({
      query: (filters) => ({
        url: "/report/post",
        method: "GET",
        params: filters,
      }),
      providesTags: ["Reports"],
    }),

    /** Delete a report (user or post) */
    deleteReport: build.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/report/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reports"],
    }),
  }),
});

/** ===== Hooks ===== */
export const {
  useGetUserReportsQuery,
  useGetReportsPostQuery,
  useDeleteReportMutation,
} = userApi;
