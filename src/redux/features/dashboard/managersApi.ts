/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/features/dashboard/managerApi.ts
import { baseApi } from "@/redux/api/baseApi"

/** ===== Types aligned to /managers response ===== */
export interface Manager {
  serial?: number // only used for lists
  id: string
  userId?: string
  firstName: string | null
  lastName?: string | null
  email: string
  profileImage?: string | null
  status?: "ACTIVE" | "INACTIVE" | string
  createdAt?: string // present in list/create but may be missing in detail

  // extra fields for single manager detail
  phoneNumber?: string | null
  gender?: string
  about?: string
  age?: number | null
  memories?: any[]
  event?: any[]
  interests?: any[]
  role?: string
  managerRole?: string[]
}

export interface ManagersMeta {
  page: number
  limit: number
  /** NOTE: backend returns totalUsers here (not totalManagers) */
  totalUsers: number
  totalPages: number
}

export interface GetManagersResponse {
  success: boolean
  message: string
  data: {
    meta: ManagersMeta
    data: Manager[]
  }
}

export interface ManagersQuery {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface GetManagerByIdResponse {
  success: boolean
  message: string
  data: Manager // single manager details
}

export interface GetManagerByIdQuery {
  id: string
  // optional query params supported by backend
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
  status?: string
  isDating?: boolean
}

export interface AddManagerResponse {
  success: boolean
  message: string
  data: Manager // returns single manager object
}

export interface UpdateManagerResponse {
  success: boolean
  message: string
  data: Manager // updated manager object
}

/** ===== API slice ===== */
export const managerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Get all managers (paginated list) */
    getManagers: build.query<GetManagersResponse, ManagersQuery | void>({
      query: (params) => ({
        url: "/managers",
        method: "GET",
        params: params ?? {},
      }),
      providesTags: ["Managers"],
    }),

    /** Get single manager by ID (with optional filters) */
    getManagerById: build.query<GetManagerByIdResponse, GetManagerByIdQuery>({
      query: ({ id, ...params }) => ({
        url: `/managers/${id}`,
        method: "GET",
        params, // pass through query params
      }),
      providesTags: (result, error, { id }) => [{ type: "Managers", id }],
    }),

    /** Add a new manager */
    addManager: build.mutation<AddManagerResponse, FormData>({
      query: (formData) => ({
        url: "/managers",
        method: "POST",
        body: formData,
        // ⚠️ No manual headers — RTK handles multipart
      }),
      invalidatesTags: ["Managers"],
    }),

    /** Update an existing manager */
   editManagerById: build.mutation<UpdateManagerResponse, { id: string, body: FormData }>({
  query: ({ id, body }) => ({
    url: `/managers/${id}`,
    method: "PUT",   // ✅ correct
    body,
  }),
  invalidatesTags: ["Managers"],
}),

  }),
})

export const {
  useGetManagersQuery,
  useGetManagerByIdQuery,
  useAddManagerMutation,
  useEditManagerByIdMutation,
} = managerApi
