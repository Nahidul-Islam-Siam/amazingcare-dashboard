 

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

// Course interface for getAllCourses (with user, enrollment, isBuy)
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
  totalEnrollments: number;
  teacherName: string;
}

// Course interface for getMyCourses (simplified version)
export interface MyCourse {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  price: number;
  teacherId: string;
  teacherName: string;
  totalEnrollments: number;
  createdAt: string;
}

export interface CoursesMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number; // Added this based on the API response
}

export interface GetAllCoursesResponse {
  success: boolean;
  message: string;
  meta: CoursesMeta;
  data: Course[];
}

// Response interface for getMyCourses
export interface GetMyCoursesResponse {
  success: boolean;
  message: string;
  meta: CoursesMeta;
  data: MyCourse[];
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

    getMyCourses: build.query<
      GetMyCoursesResponse,  
      {
        role?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: ({ role, page, limit } = {}) => {
        const params = new URLSearchParams();
        
        if (role) params.append("role", role);
        if (page) params.append("page", String(page));
        if (limit) params.append("limit", String(limit));

        return {
          url: `/courses/see-my-courses?${params.toString()}`,
          method: "GET",
        };  
      },
      providesTags: ["courses"],
    }),


// In your courseApi.ts file, inside endpoints:

addCourse: build.mutation({
  query: (formData) => ({
    url: `/courses/create-course`,
    method: "POST",
    body: formData,
  }),
  invalidatesTags: ["courses"],
}),

addVideoLessonById: build.mutation({
  query: ({ courseId, formData }) => ({
    url: `/videos/${courseId}`,
    method: "POST",
    body: formData,
  }),
  invalidatesTags: ["courses"],
}),

addNotesById: build.mutation({
  query: ({ courseId, noteData }) => ({
    url: `/notes/${courseId}`,
    method: "POST",
    body: noteData,
  }),
  invalidatesTags: ["courses"],
}),

// In courseApi.ts
addQuizzById: build.mutation({
  query: ({ courseId, quizData }) => ({
    url: `/quizzes/${courseId}`,
    method: "POST",
    body: quizData,
  }),
  invalidatesTags: ["courses"],
}),

addAssignmentById: build.mutation({
  query: ({ courseId, assignmentData }) => ({
    url: `/assignments/${courseId}`,
    method: "POST",
    body: assignmentData,
  }),
  invalidatesTags: ["courses"],
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

export const { useGetAllCoursesQuery, useGetMyCoursesQuery, useDeleteCourseMutation, useAddCourseMutation, useAddVideoLessonByIdMutation, useAddNotesByIdMutation, useAddQuizzByIdMutation, useAddAssignmentByIdMutation } = courseApi;