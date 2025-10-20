/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi"

// =========================
// Gift Card Types
// =========================
export interface GiftCard {
  id: string
  name: string | null
  gender: string
  category: string
  image: string
  price: number
  createdAt: string
  updatedAt: string
  count?: number
}

export interface GiftCategoryMap {
  [category: string]: GiftCard[]
}

export interface UserGifts {
  purchases: GiftCategoryMap
  received: GiftCategoryMap
}

// =========================
// User Profile Types
// =========================
export interface UserProfile {
  id: string
  firstName: string | null
  isLoading: boolean
  lastName: string | null
  profileImage: string | null
  email: string
  totalCoins: number
  phoneNumber: string | null
  gender: string | null
  address: string | null
  about: string | null
  age: number | null
  status: string
  role?: string
  memories: any[]
  event: any[]
  interests: string[]
  datingInterests: string[]
  datingAbout: string | null
  datingImage: string[]
  interestedGender: string
  interestsDetails: any[]
  datingInterestsDetails: any[]
  followersCount: number
  followingsCount: number
  gifts: UserGifts
  isProfileComplete: boolean
  managerRole: string[]
}

export interface GetUserProfileResponse {
  success: boolean
  message: string
  data: UserProfile
}

// =========================
// Dashboard - Get All Users
// =========================
export interface GetAllUsersQueryParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
  search?: string
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED"
  isDating?: boolean
}

export interface DashboardUser {
  serial: number
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  profileImage: string | null
  status: "ACTIVE" | "INACTIVE" | "BLOCKED"
  createdAt: string
}

export interface DashboardMeta {
  page: number
  limit: number
  totalUsers: number
  totalPages: number
}

export interface GetAllUsersResponse {
  success: boolean
  message: string
  data: {
    meta: DashboardMeta
    data: DashboardUser[]
  }
}

// =========================
// API Endpoints
// =========================
export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Fetch the current user's profile
     */
    getProfile: build.query<GetUserProfileResponse, void>({
      query: () => ({
        url: "/users/profile",
        method: "GET",
      }),
      transformResponse: (response: GetUserProfileResponse) => {
        if (response?.data?.profileImage) {
          response.data.profileImage = response.data.profileImage.trim()
        }
        return response
      },
      providesTags: ["Profile"],
    }),

    /**
     * Fetch profile by user ID (for admin dashboard)
     */
    getProfileById: build.query<GetUserProfileResponse, string>({
      query: (id) => ({
        url: `/dashboard/${id}`, // ✅ adjust if backend really uses /dashboard/:id
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    /**
     * Update the current user's profile
     * (FormData is supported for image uploads)
     */
    updateProfile: build.mutation<GetUserProfileResponse, FormData>({
      query: (formData) => ({
        url: "/users/update-profile",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),

        updateProfileImage: build.mutation<GetUserProfileResponse, FormData>({
      query: (formData) => ({
        url: "/users/update-profile-image",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),

    /**
     * Get all users (admin dashboard)
     */
    getAllUsers: build.query<GetAllUsersResponse, Partial<GetAllUsersQueryParams>>({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params,
      }),
      providesTags: ["Users"],
    }),
  }),
})

// =========================
// Exported Hooks
// =========================
export const {
  useGetProfileQuery,
  useGetProfileByIdQuery,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
  useUpdateProfileImageMutation

} = userApi

export const userApiReducerPath = userApi.reducerPath
export type UserApiType = typeof userApi
