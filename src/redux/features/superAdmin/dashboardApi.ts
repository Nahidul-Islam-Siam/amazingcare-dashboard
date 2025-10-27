 

// import { baseApi } from "@/redux/api/baseApi";

// export interface CourseTeacher {
//   id: string;
//   firstName: string;
// }

// export interface CourseEnrollment {
//   studentId: string;
//   courseId: string;
//   paymentId: string;
// }

// // Course interface for getAllCourses (with user, enrollment, isBuy)
// export interface Course {
//   id: string;
//   name: string;
//   description: string;
//   thumbnailUrl: string;
//   price: number;
//   teacherId: string;
//   level: string;
//   sessionPrice: number;
//   createdAt: string;
//   updatedAt: string;
//   videoCount: number;
//   videoDuration: string;
//   reviewCount: number;
//   recommended: boolean;
//   user: CourseTeacher;
//   enrollment: CourseEnrollment[];
//   isBuy: boolean;
// }

// // Course interface for getMyCourses (simplified version)
// export interface MyCourse {
//   id: string;
//   name: string;
//   description: string;
//   thumbnailUrl: string;
//   price: number;
//   teacherId: string;
//   teacherName: string;
//   totalEnrollments: number;
//   createdAt: string;
// }

// export interface CoursesMeta {
//   page: number;
//   limit: number;
//   total: number;
//   totalPage: number; // Added this based on the API response
// }

// export interface GetAllCoursesResponse {
//   success: boolean;
//   message: string;
//   meta: CoursesMeta;
//   data: Course[];
// }

// // Response interface for getMyCourses
// export interface GetMyCoursesResponse {
//   success: boolean;
//   message: string;
//   meta: CoursesMeta;
//   data: MyCourse[];
// }

// export const dashboardApi = baseApi.injectEndpoints({
//   endpoints: (build) => ({
    
// getDashBoardApi: build.mutation({
//       query: () => ({
//         url: `/courses/dashboard`,
//         method: "GET",
//       }),
//         providesTags: ["dashboard"],
//     }),
//   }),
// });

// export const {   } = dashboardApi;