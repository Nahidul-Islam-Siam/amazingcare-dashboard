/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TableSkeleton from "@/lib/Loader";
import { useDeleteCourseMutation, useGetAllCoursesQuery } from "@/redux/features/teacherDashboard/courseApi";
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";



export default function  CoursesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // <-- search state
  const limit = 10;

  // Fetch courses from API with search
  const { data, isLoading, isError } = useGetAllCoursesQuery({
    page: currentPage,
    limit,
    searchTerm,
  });

  const [deleteCourse ] = useDeleteCourseMutation();

  const courses = data?.data || [];
  const totalCourses = data?.meta?.total || 0;
  const totalPages = Math.ceil(totalCourses / limit);

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Pagination handlers
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  if (isLoading) return <TableSkeleton />;

  if (isError)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Failed to load courses.
      </div>
    );


 const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#EF4444",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        // Call the mutation
        const res = await deleteCourse(id).unwrap();

        // Show response message from server
        if (res?.success) {
          Swal.fire("Deleted!", res.message || "The course has been deleted.", "success");
        } else {
          Swal.fire("Failed!", res.message || "Failed to delete the course.", "error");
        }
      } catch (error: any) {
        Swal.fire("Error!", error?.data?.message || "Something went wrong.", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h1 className="text-2xl font-bold">All Courses</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">John Doe</span>
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="font-semibold">J</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-blue-100 border border-blue-300">
            <CardContent className="py-8 text-center">
              <p className="text-lg font-medium text-gray-700 mb-1">
                Total Courses
              </p>
              <p className="text-xl font-bold text-gray-900">{totalCourses}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Add Course */}
        <div className="flex justify-between mb-6 gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-4 py-2 w-full sm:w-1/3"
          />

          <Link href="/dashboard/courses/add-course">
            <Button className="bg-blue-600 px-4 py-2 hover:bg-blue-700 text-white gap-2">
              Add Course
            </Button>
          </Link>
        </div>

        {/* Courses Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  {[
                    "Title",
                    "Teacher",
                    "Description",
                    "Price",
                    "Video Count",
                    "Recommended",
                    "Action",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left font-semibold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No courses found.
                    </td>
                  </tr>
                ) : (
                  courses.map((course: any) => (
                    <tr
                      key={course.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3">{course.name}</td>
                      <td className="px-4 py-3">{course.user.firstName}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {course.description || "-"}
                      </td>
                      <td className="px-4 py-3">${course.price}</td>
                      <td className="px-4 py-3 text-center">{course.videoCount}</td>
                      <td className="px-4 py-3 text-center">
                        {course.recommended ? (
                          <span className="text-green-500 font-bold">✔</span>
                        ) : (
                          <span className="text-red-500 font-bold">✘</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center relative">
                        <button
                          className="text-gray-400 hover:text-gray-600 relative"
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === course.id ? null : course.id
                            )
                          }
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {openDropdown === course.id && (
                          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(null);
                                import("sweetalert2").then(({ default: Swal }) =>
                                  Swal.fire({
                                    title: "Update Course",
                                    text: `Update course "${course.name}"?`,
                                    icon: "info",
                                    showCancelButton: true,
                                    confirmButtonText: "Yes, update",
                                    confirmButtonColor: "#3B82F6",
                                  })
                                );
                              }}
                            >
                              Update
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(null);
                                handleDelete(course.id
                                );
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-start gap-1 mt-6 flex-wrap">
            <button
              className="px-3 py-2 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-3 py-2 text-sm rounded ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border hover:bg-gray-50"
                }`}
                onClick={() => paginate(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="px-3 py-2 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
