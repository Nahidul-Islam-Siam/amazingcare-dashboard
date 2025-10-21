"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

export default function CoursesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalCourses = 48;
  const coursesPerPage = 10;
  const totalPages = Math.ceil(totalCourses / coursesPerPage);
  type DropdownId = number | null;
  // Generate mock data for 48 courses
  const courses = Array.from({ length: 48 }, (_, i) => ({
    id: i + 1,
    title: "Foundations of the Faith",
    teacher: "Charli Falcon",
    description:
      "Foundations of the Faith helps you understand the basics of Christian doctrine.",
    lessons: 34,
    price: 19,
    notes: i % 3 !== 0, // Add notes field
    quizzes: i % 3 !== 0,
    assignment: i % 4 !== 0,
    qa: i % 5 !== 0,
    action: true, // Always show action for demo
  }));

  // Get current page courses
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);

  // Pagination handlers
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Dropdown state

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h1 className="text-2xl font-bold">All Courses</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">John Doe</span>
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 0a4 4 0 1 0 0 8A4 4 0 0 0 8 0zm0 12v4H6v-4H5V8h8v4h-1v4z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              title: "Total Course",
              value: "48",
              bg: "bg-blue-100",
              border: "border-blue-300",
            },
            {
              title: "Top Courses",
              value: "12",
              bg: "bg-white",
              border: "border-gray-200",
            },
          ].map((card, index) => (
            <Card key={index} className={`${card.bg} ${card.border} border`}>
              <CardContent className="py-8 text-center">
                <p className="text-lg font-medium text-gray-700 mb-1">
                  {card.title}
                </p>
                <p className="text-xl font-bold text-gray-900">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Live Button */}
        <div className="flex justify-end mb-6">
          <Button className="bg-blue-600 px-4 py-2 hover:bg-blue-700 text-white gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M2.5 21.5H21.5V2.5H2.50001L2.5 21.5Z"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="square"
              />
              <path
                d="M12 8V16M16 12H8"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="square"
              />
            </svg>
            Add Live
          </Button>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Teacher Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Lesson No.
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Price
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Notes
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Quizzes
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Assignment
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Q&A
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentCourses.map((course) => (
                  <tr key={course.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{course.title}</td>
                    <td className="px-4 py-3 text-sm">{course.teacher}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {course.description}
                    </td>
                    <td className="px-4 py-3 text-sm">{course.lessons}</td>
                    <td className="px-4 py-3 text-sm">${course.price}</td>
                    <td className="px-4 py-3 text-center">
                      {course.notes ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M3 2.25C2.58579 2.25 2.25 2.58579 2.25 3V21C2.25 21.4142 2.58579 21.75 3 21.75H21C21.4142 21.75 21.75 21.4142 21.75 21V3C21.75 2.58579 21.4142 2.25 21 2.25H3ZM16.4395 9.8981L17.3375 9.45823L16.4578 7.66211L15.5597 8.10198C13.6039 9.05993 12.0896 10.7037 11.0866 12.0436C10.7389 12.508 10.4455 12.9455 10.2096 13.3209C9.93051 13.079 9.65521 12.8787 9.41255 12.7187C9.14576 12.5428 8.61632 12.268 8.41608 12.164C8.40801 12.1599 8.40047 12.1559 8.39351 12.1523L7.47436 11.7584L6.68652 13.5967L7.6031 13.9895C7.73276 14.0569 8.10167 14.25 8.31163 14.3885C8.74043 14.6712 9.22894 15.0715 9.58036 15.5735L10.552 16.9616L11.2971 15.441C11.3555 15.3314 11.5266 15.0112 11.6448 14.8098C11.8817 14.4062 12.2332 13.8492 12.6876 13.2422C13.6095 12.0107 14.8953 10.6544 16.4395 9.8981Z"
                            fill="#2AF531"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M22.25 1.75V22.25H1.75V1.75H22.25ZM11.999 10.585L9 7.58594L7.58594 9L10.585 12L7.58594 15L9 16.4141L11.999 13.4141L15 16.4141L16.4141 15L13.4141 12L16.4141 9L15 7.58594L11.999 10.585Z"
                            fill="#FF1717"
                          />
                        </svg>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {course.quizzes ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M3 2.25C2.58579 2.25 2.25 2.58579 2.25 3V21C2.25 21.4142 2.58579 21.75 3 21.75H21C21.4142 21.75 21.75 21.4142 21.75 21V3C21.75 2.58579 21.4142 2.25 21 2.25H3ZM16.4395 9.8981L17.3375 9.45823L16.4578 7.66211L15.5597 8.10198C13.6039 9.05993 12.0896 10.7037 11.0866 12.0436C10.7389 12.508 10.4455 12.9455 10.2096 13.3209C9.93051 13.079 9.65521 12.8787 9.41255 12.7187C9.14576 12.5428 8.61632 12.268 8.41608 12.164C8.40801 12.1599 8.40047 12.1559 8.39351 12.1523L7.47436 11.7584L6.68652 13.5967L7.6031 13.9895C7.73276 14.0569 8.10167 14.25 8.31163 14.3885C8.74043 14.6712 9.22894 15.0715 9.58036 15.5735L10.552 16.9616L11.2971 15.441C11.3555 15.3314 11.5266 15.0112 11.6448 14.8098C11.8817 14.4062 12.2332 13.8492 12.6876 13.2422C13.6095 12.0107 14.8953 10.6544 16.4395 9.8981Z"
                            fill="#2AF531"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M22.25 1.75V22.25H1.75V1.75H22.25ZM11.999 10.585L9 7.58594L7.58594 9L10.585 12L7.58594 15L9 16.4141L11.999 13.4141L15 16.4141L16.4141 15L13.4141 12L16.4141 9L15 7.58594L11.999 10.585Z"
                            fill="#FF1717"
                          />
                        </svg>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {course.assignment ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M3 2.25C2.58579 2.25 2.25 2.58579 2.25 3V21C2.25 21.4142 2.58579 21.75 3 21.75H21C21.4142 21.75 21.75 21.4142 21.75 21V3C21.75 2.58579 21.4142 2.25 21 2.25H3ZM16.4395 9.8981L17.3375 9.45823L16.4578 7.66211L15.5597 8.10198C13.6039 9.05993 12.0896 10.7037 11.0866 12.0436C10.7389 12.508 10.4455 12.9455 10.2096 13.3209C9.93051 13.079 9.65521 12.8787 9.41255 12.7187C9.14576 12.5428 8.61632 12.268 8.41608 12.164C8.40801 12.1599 8.40047 12.1559 8.39351 12.1523L7.47436 11.7584L6.68652 13.5967L7.6031 13.9895C7.73276 14.0569 8.10167 14.25 8.31163 14.3885C8.74043 14.6712 9.22894 15.0715 9.58036 15.5735L10.552 16.9616L11.2971 15.441C11.3555 15.3314 11.5266 15.0112 11.6448 14.8098C11.8817 14.4062 12.2332 13.8492 12.6876 13.2422C13.6095 12.0107 14.8953 10.6544 16.4395 9.8981Z"
                            fill="#2AF531"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M22.25 1.75V22.25H1.75V1.75H22.25ZM11.999 10.585L9 7.58594L7.58594 9L10.585 12L7.58594 15L9 16.4141L11.999 13.4141L15 16.4141L16.4141 15L13.4141 12L16.4141 9L15 7.58594L11.999 10.585Z"
                            fill="#FF1717"
                          />
                        </svg>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {course.qa ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M3 2.25C2.58579 2.25 2.25 2.58579 2.25 3V21C2.25 21.4142 2.58579 21.75 3 21.75H21C21.4142 21.75 21.75 21.4142 21.75 21V3C21.75 2.58579 21.4142 2.25 21 2.25H3ZM16.4395 9.8981L17.3375 9.45823L16.4578 7.66211L15.5597 8.10198C13.6039 9.05993 12.0896 10.7037 11.0866 12.0436C10.7389 12.508 10.4455 12.9455 10.2096 13.3209C9.93051 13.079 9.65521 12.8787 9.41255 12.7187C9.14576 12.5428 8.61632 12.268 8.41608 12.164C8.40801 12.1599 8.40047 12.1559 8.39351 12.1523L7.47436 11.7584L6.68652 13.5967L7.6031 13.9895C7.73276 14.0569 8.10167 14.25 8.31163 14.3885C8.74043 14.6712 9.22894 15.0715 9.58036 15.5735L10.552 16.9616L11.2971 15.441C11.3555 15.3314 11.5266 15.0112 11.6448 14.8098C11.8817 14.4062 12.2332 13.8492 12.6876 13.2422C13.6095 12.0107 14.8953 10.6544 16.4395 9.8981Z"
                            fill="#2AF531"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M22.25 1.75V22.25H1.75V1.75H22.25ZM11.999 10.585L9 7.58594L7.58594 9L10.585 12L7.58594 15L9 16.4141L11.999 13.4141L15 16.4141L16.4141 15L13.4141 12L16.4141 9L15 7.58594L11.999 10.585Z"
                            fill="#FF1717"
                          />
                        </svg>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center relative">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="text-gray-400 hover:text-gray-600 relative"
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === course.id ? null : course.id
                            )
                          }
                        >
                          <MoreHorizontal size={18} />
                       {openDropdown === course.id && (
  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
    <button 
      className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
      onClick={(e) => {
        e.stopPropagation();
        setOpenDropdown(null);
        import('sweetalert2').then(({ default: Swal }) => {
          Swal.fire({
            title: 'Update Course',
            text: `Are you sure you want to update course #${course.id}?`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3B82F6',
          }).then((result) => {
            if (result.isConfirmed) {
              // Perform update logic here
              Swal.fire('Updated!', `Course #${course.id} has been updated.`, 'success');
            }
          });
        });
      }}
    >
      Update
    </button>
    <button 
      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      onClick={(e) => {
        e.stopPropagation();
        setOpenDropdown(null);
        import('sweetalert2').then(({ default: Swal }) => {
          Swal.fire({
            title: 'Are you sure?',
            text: `You won't be able to revert the deletion of course #${course.id}!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel',
            confirmButtonColor: '#EF4444',
            reverseButtons: true,
          }).then((result) => {
            if (result.isConfirmed) {
              // Perform delete logic here
              Swal.fire('Deleted!', `Course #${course.id} has been deleted.`, 'success');
            }
          });
        });
      }}
    >
      Delete
    </button>
  </div>
)}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-start gap-1 mt-6">
          <button
            className="px-3 py-2 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>

          {currentPage > 3 && (
            <>
              <button
                className="px-3 py-2 text-sm border rounded hover:bg-gray-50"
                onClick={() => paginate(1)}
              >
                1
              </button>
              <span className="px-2 text-sm text-gray-500">...</span>
            </>
          )}

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return pageNum;
          }).map((pageNum) => (
            <button
              key={pageNum}
              className={`px-3 py-2 text-sm rounded ${
                currentPage === pageNum
                  ? "bg-blue-600 text-white"
                  : "border hover:bg-gray-50"
              }`}
              onClick={() => paginate(pageNum)}
            >
              {pageNum}
            </button>
          ))}

          {currentPage < totalPages - 2 && (
            <>
              <span className="px-2 text-sm text-gray-500">...</span>
              <button
                className="px-3 py-2 text-sm border rounded hover:bg-gray-50"
                onClick={() => paginate(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            className="px-3 py-2 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
