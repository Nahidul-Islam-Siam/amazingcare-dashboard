import { baseApi } from "@/redux/api/baseApi";
// src/types/user.ts
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
  totalUsers: number;
  totalPages: number;
}

export interface GetUsersResponse {
  success: boolean;
  message: string;
  data: {
    meta: Meta;
    data: User[];
  };
}


export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<
      GetUsersResponse,
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
        url: "/dashboard/all-users",
        method: "GET",
        // 👇 RTK Query will build the query string for you:
        params: filters,
      }),
      providesTags: ["Users"],
    }),

    deleteUser: build.mutation({
      query: (id) => ({
        url: `/dashboard/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    })
  }),
});

export const { useGetUsersQuery, useDeleteUserMutation } = userApi;
