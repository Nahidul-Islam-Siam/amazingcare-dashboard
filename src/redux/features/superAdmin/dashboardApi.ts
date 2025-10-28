import { baseApi } from "@/redux/api/baseApi";

// Define Interfaces

export interface DashboardStats {
  totalDonation: number;
  totalCourses: number;
  totalStudents: number;
  totalTeachers: number;
}

export interface DailyDonation {
  day: number;
  amount: number;
}

export interface Student {
  id: string;
  fullName: string;
  email: string;
  profileImage: string;
}

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  profileImage: string;
}

export interface DashboardData {
  month: string;
  dailyDonations: DailyDonation[];
  students: Student[];
  teachers: Teacher[];
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: {
    stats: DashboardStats;
    data: DashboardData;
  };
}

// Enhanced API Slice
export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ✅ Use query (not mutation) to fetch dashboard data
    getDashboardData: build.query<DashboardResponse, void>({
      query: () => ({
        url: "/admin/stats",
        method: "GET",
      }),
      providesTags: ["Dashboard"], // For cache invalidation later if needed
    }),
  }),
});

// Export Hook
export const { useGetDashboardDataQuery } = dashboardApi;