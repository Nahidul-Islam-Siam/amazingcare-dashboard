/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

// === Interfaces for Teacher Dashboard (Unchanged) ===

export interface DashboardStats {
  totalRevenue: number;
  totalCourses: number;
  totalEnrollments: number;
  totalBookings: number;
  totalUpcomingLiveSessions: number;
}

export interface DailyRevenue {
  day: number;
  amount: number;
}

export interface LiveSession {
  id: string;
  teacherId: string;
  title: string;
  imageurl: string;
  meetingLink: string;
  date: string; // ISO date string
  time: string;
  status: string;
  upcomingLiveStatus: string;
  paymentStatus: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  price: number;
  teacherName: string | null;
  totalLesson: number | null;
  teacherId: string;
  level: string;
  sessionPrice: number;
  createdAt: string;
  updatedAt: string;
  videoCount: number;
  videoDuration: string;
  reviewCount: number;
  recommended: boolean;
  enrolledCount: number | null;
  status: any;
  enrollment: Enrollment[];
  enrolledStudents: EnrolledStudent[];
}

export interface StudentBase {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
}

export interface Payment {
  id: string;
  status: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  paymentId: string;
  paymentStatus: string;
  hasPaid: boolean;
  createdAt: string;
  updatedAt: string;
  student: StudentBase;
  payment: Payment;
}

export interface EnrolledStudent {
  id: string;
  fullName: string;
  email: string;
  profileImage: string;
  hasPaid: boolean;
}

export interface TodayRemainingSession {
  id: string;
  userId: string;
  courseId: string;
  date: string;
  time: string;
  duration: number;
  sessionEndTime: string;
  status: string;
  paymentStatus: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  course: {
    id: string;
    name: string;
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface TeacherDashboardData {
  month: string;
  dailyRevenue: DailyRevenue[];
  latestUpcomingLiveSessions: LiveSession[];
  courses: Course[];
  todaysRemaining: TodayRemainingSession[];
}

export interface TeacherDashboardResponse {
  success: boolean;
  message: string;
  data: {
    stats: DashboardStats;
    data: TeacherDashboardData;
  };
}

// === Define New Interfaces for General Admin Dashboard Data ===

export interface AdminDashboardStats {
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

export interface AdminDashboardData {
  month: string;
  dailyDonations: DailyDonation[];
  students: Student[];
  teachers: Teacher[];
}

export interface AdminDashboardResponse {
  success: boolean;
  message: string;
  data: {
    stats: AdminDashboardStats;
    data: AdminDashboardData;
  };
}

// === Enhanced API Slice with Corrected Endpoints ===
export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Fetch general admin dashboard data
    getDashboardData: build.query<AdminDashboardResponse, void>({
      query: () => ({
        url: "/admin/stats",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),

    // Fetch teacher-specific dashboard data
    getTeacherDashboardData: build.query<TeacherDashboardResponse, void>({
      query: () => ({
        url: "/admin/stats-teacher",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

// === Export Hooks ===
export const {
  useGetDashboardDataQuery,
  useGetTeacherDashboardDataQuery,
} = dashboardApi;