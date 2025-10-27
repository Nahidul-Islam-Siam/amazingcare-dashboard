import { baseApi } from "@/redux/api/baseApi";

// Define User interface
export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
  role: "USER" | "TEACHER" | "ADMIN";
  isNotification: boolean;
  createdAt: string;
  updatedAt: string;
  fullName: string;
}

// Define GetUsersResponse
export interface GetUsersResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }
    data: User[];
  };
}

// Update the endpoint to use correct response type
export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query<GetUsersResponse, { page?: number; limit?: number; role?: string }>({
      query: ({ page, limit, role }) => ({
        url: `/users`,
        method: "GET",
        params: { page, limit, role },
      }),
    }),

    deleteUser: build.mutation<{ success: boolean; message: string }, string>({
      query: (userId) => ({
        url: `/users/delete/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useGetAllUsersQuery , useDeleteUserMutation} = userApi;