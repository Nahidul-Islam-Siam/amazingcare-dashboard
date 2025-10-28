/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";

import { MoreHorizontal } from "lucide-react";
import Swal from 'sweetalert2';
import { useDeleteCourseMutation, useGetAllCoursesQuery } from "@/redux/features/teacherDashboard/courseApi";
import { useState } from "react";
import TableSkeleton from "@/lib/Loader";

export default function AdminCoursesPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useGetAllCoursesQuery({
    page,
    limit,
  });

  const [deleteCourse] = useDeleteCourseMutation();

  const courses = data?.data || [];
  const meta = data?.meta;
  const totalPage = meta?.totalPage || 1;
  const totalCourses = meta?.total || 0;

  // Handle page change
  const goToPage = (pageNum: number) => {
    if (pageNum < 1 || pageNum > totalPage) return;
    setPage(pageNum);
  };

  // Show loading state
  if (isLoading) {
    return (
      <TableSkeleton  />
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-lg text-red-600">Failed to load courses. Please try again later.</p>
      </div>
    );
  }

  // Delete handler — now calls real API
  const handleDelete = async (courseId: string, courseName: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${courseName}" (ID: ${courseId})`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'border-2 border-red-200 rounded-lg shadow-xl',
        confirmButton: 'bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md',
        cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md'
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      try {
        // 🔥 Call real delete mutation
        const res = await deleteCourse(courseId).unwrap();

        await Swal.fire({
          title: 'Deleted!',
          text: res.message || `Course "${courseName}" has been deleted.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: 'border-2 border-green-200 rounded-lg shadow-xl'
          }
        });
      } catch (error: any) {
        Swal.fire({
          title: 'Error!',
          text: error?.data?.message || 'Failed to delete course.',
          icon: 'error',
          customClass: {
            popup: 'border-2 border-red-200 rounded-lg shadow-xl'
          }
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white">
        <h1 className="text-2xl font-bold text-gray-900">Course List</h1>
        <Button variant="outline" size="icon" className="border-gray-300">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing <strong>{courses.length}</strong> of <strong>{totalCourses}</strong> courses
          </p>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">Course ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Course Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Enrolled</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Teacher</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No courses found.
                    </td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-700">{course.id.slice(-6).toUpperCase()}</td>
                      <td className="px-4 py-3 text-sm">{course.name}</td>
                      <td className="px-4 py-3 text-sm">{course.totalEnrollments || 0}</td>
                      <td className="px-4 py-3 text-sm">{course.teacherName}</td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(course.id, course.name)}
                          className="bg-red-200 hover:bg-red-300 text-red-700 text-xs font-medium px-3 py-1"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Custom Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <p className="text-sm text-gray-600">
            Page {page} of {totalPage} • Total: {totalCourses} courses
          </p>

          <div className="flex items-center gap-1 flex-wrap justify-center">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1 min-w-[36px]"
            >
              ← Prev
            </Button>

            {/* Dynamic Page Numbers */}
            {Array.from({ length: totalPage }, (_, i) => i + 1).map((pageNum) => {
              const isCurrent = pageNum === page;
              const isNearCurrent = Math.abs(pageNum - page) <= 2;
              const isFirstOrLast = pageNum === 1 || pageNum === totalPage;

              // Always show first, last, current, and nearby pages
              if (isFirstOrLast || isCurrent || isNearCurrent) {
                return (
                  <Button
                    key={pageNum}
                    size="sm"
                    variant={isCurrent ? "default" : "outline"}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-1 min-w-[36px] ${
                      isCurrent ? 'bg-blue-600 hover:bg-blue-700' : ''
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              }

              // Ellipsis: After first page when far from start
              if (pageNum === 4 && page > 5) {
                return (
                  <span key="dots-start" className="px-1 text-gray-500 select-none">…</span>
                );
              }

              // Ellipsis: Before last page when far from end
              if (pageNum === totalPage - 3 && page < totalPage - 4) {
                return (
                  <span key="dots-end" className="px-1 text-gray-500 select-none">…</span>
                );
              }

              return null;
            })}

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPage}
              className="px-3 py-1 min-w-[36px]"
            >
              Next →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}