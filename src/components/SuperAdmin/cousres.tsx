/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TableSkeleton from "@/lib/Loader";
import { useDeleteCourseMutation, useGetMyCoursesQuery } from "@/redux/features/teacherDashboard/courseApi";
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function CoursesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;

  // Fetch logged-in teacher's courses
  const { data, isLoading, isError } = useGetMyCoursesQuery({
    role: "TEACHER",
    page: currentPage,
    limit,
  });

  const [deleteCourse] = useDeleteCourseMutation();

  // Extract data safely
  const allCourses = data?.data || [];
  const totalCourses = data?.meta?.total || 0;
  const totalPages = Math.ceil(totalCourses / limit);

  // Client-side search filter
  const filteredCourses = allCourses.filter((course: any) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Close dropdown on outside click or scroll
  useEffect(() => {
    const handleClickOutside = () => {
      if (openDropdown) setOpenDropdown(null);
    };

    const handleScroll = () => {
      if (openDropdown) setOpenDropdown(null);
    };

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true); // Capture phase

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [openDropdown]);

  // Pagination handlers
  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) return <TableSkeleton />;
  if (isError)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Failed to load your courses. Please try again later.
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
        const res = await deleteCourse(id).unwrap();
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
      <div className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold">My Courses</h1>
      </div>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-blue-100 border border-blue-300">
            <CardContent className="py-8 text-center">
              <p className="text-lg font-medium text-gray-700 mb-1">Total Courses</p>
              <p className="text-xl font-bold text-gray-900">{totalCourses}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Add Course */}
        <div className="flex flex-wrap justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search courses by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-4 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Link href="/dashboard/courses/add-course">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
              Add Course
            </Button>
          </Link>
        </div>

        {/* Showing Info */}
        {filteredCourses.length > 0 && (
          <p className="text-sm text-gray-600 mb-4">
            Showing {filteredCourses.length} of {totalCourses} course(s)
          </p>
        )}

        {/* Courses Table */}
        <div className="border rounded-lg overflow-x-auto overflow-y-visible relative shadow-sm">
          <table className="w-full text-sm table-auto">
            <thead>
              <tr className="bg-blue-600 text-white">
                {["Title", "Teacher", "Description", "Price", "Enrollments", "Created At", "Action"].map(
                  (header) => (
                    <th key={header} className="px-4 py-3 text-left font-semibold min-w-[120px]">
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500 italic">
                    {searchTerm
                      ? `No courses match "${searchTerm}". Try a different keyword.`
                      : "You haven't created any courses yet."}
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course: any) => (
                  <tr
                    key={course.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium break-words">{course.name}</td>
                    <td className="px-4 py-3">{course.teacherName}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                      {course.description || "-"}
                    </td>
                    <td className="px-4 py-3">${course.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">{course.totalEnrollments}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>
                    <td
                      className="px-4 py-3 text-center relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Action Button with Unique ID */}
                      <button
                        id={`action-btn-${course.id}`}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-0"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenDropdown(openDropdown === course.id ? null : course.id);
                        }}
                        aria-label="More actions"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {/* Dropdown Menu using Fixed Positioning */}
                      {openDropdown === course.id && (
                        <div
                          className="fixed bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[120px]"
                          style={{
                            top: `${
                              window.scrollY +
                              (document.getElementById(`action-btn-${course.id}`)?.getBoundingClientRect()?.bottom ??
                              0)
                            }px`,
                            right: `${
                              window.innerWidth -
                              (document.getElementById(`action-btn-${course.id}`)?.getBoundingClientRect().right ||
                                0)
                            }px`,
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <Link href={`/dashboard/courses/all-courses/lessons/${course.id}`}>
                            <button className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">
                              Update Lessons
                            </button>
                          </Link>
                                <Link href={`/dashboard/courses/all-courses/notes/${course.id}`}>
                            <button className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">
                              Update Notes
                            </button>
                          </Link>
                                   <Link href={`/dashboard/courses/all-courses/quizzes/${course.id}`}>
                            <button className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">
                              Update Quizzes
                            </button>
                          </Link>
                                       <Link href={`/dashboard/courses/all-courses/assignments/${course.id}`}>
                            <button className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">
                              Update Assignments
                            </button>
                          </Link>
                       
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setOpenDropdown(null);
                              handleDelete(course.id);
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-start gap-1 mt-6 flex-wrap">
            <button
              className="px-3 py-2 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-3 py-2 text-sm rounded min-w-10 ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border hover:bg-gray-50 text-gray-700"
                }`}
                onClick={() => paginate(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="px-3 py-2 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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