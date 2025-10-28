import { baseApi } from "@/redux/api/baseApi";

// Minimal User info for donations
export interface DonationUser {
  userId: string;
  fullName: string;
  email: string;
  profileImage: string;
  role: string;
}

// Donation item
export interface Donation {
  serial: number;
  donationId: string;
  amount: number;
  donatedAt: string;
  userId: string;
  status: "ACTIVE" | "INACTIVE";
  user: DonationUser;
  fullName: string;
  email: string;
}

// Response from API
export interface GetDonationListResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: Donation[];
}

// API Slice
export const donationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDonationList: build.query<GetDonationListResponse, { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: `/admin/all-donations`,
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: ["Donation"],
    }),
  }),
});

// Export hooks
export const { useGetDonationListQuery } = donationApi;
