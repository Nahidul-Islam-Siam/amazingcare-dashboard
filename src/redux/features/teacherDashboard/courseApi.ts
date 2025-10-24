/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";



export interface CourseTeacher {
  id: string;
  firstName: string;
}

export interface CourseEnrollment {
  studentId: string;
  courseId: string;
  paymentId: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  price: number;
  teacherId: string;
  level: string;
  sessionPrice: number;
  createdAt: string;
  updatedAt: string;
  videoCount: number;
  videoDuration: string;
  reviewCount: number;
  recommended: boolean;
  user: CourseTeacher;
  enrollment: CourseEnrollment[];
  isBuy: boolean;
}

export interface CoursesMeta {
  page: number;
  limit: number;
  total: number;
}

export interface GetAllCoursesResponse {
  success: boolean;
  message: string;
  meta: CoursesMeta;
  data: Course[];
}


export const courseApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCourses: build.query<
      GetAllCoursesResponse,
      {
        searchTerm?: string;
        minPrice?: number;
        maxPrice?: number;
        page?: number;
        limit?: number;
      }
    >({
      query: ({ searchTerm, minPrice, maxPrice, page, limit } = {}) => {
        const params = new URLSearchParams();

        if (searchTerm) params.append("searchTerm", searchTerm);
        if (minPrice) params.append("minPrice", String(minPrice));
        if (maxPrice) params.append("maxPrice", String(maxPrice));
        if (page) params.append("page", String(page));
        if (limit) params.append("limit", String(limit));

        return {
          url: `/courses?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["courses"],
    }),


deleteCourse: build.mutation({
  query: (id) => ({
    url: `/courses/${id}`,
    method: "DELETE",
  }),
  invalidatesTags: ["courses"],
}),

  }),
});

export const { useGetAllCoursesQuery , useDeleteCourseMutation} = courseApi;
