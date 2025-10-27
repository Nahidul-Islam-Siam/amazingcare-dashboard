"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeleteUserMutation, useGetAllUsersQuery, User } from "@/redux/features/superAdmin/userApi";
import { MoreHorizontal } from "lucide-react";
import Swal from "sweetalert2";
import { useState } from "react";
import TableSkeleton from "@/lib/Loader";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, isError, refetch } = useGetAllUsersQuery({ page, limit });
  const [deleteUser] = useDeleteUserMutation();

  // Extract users and meta
  const users: User[] = data?.data?.data || [];
  const meta = data?.data?.meta;

  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1;

  // Filter by role
  const teachers = users.filter((user) => user.role === "TEACHER");
  const students = users.filter((user) => user.role === "USER");

  // Handle Delete
  const handleDelete = async (type: "teacher" | "student", id: string, name: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${type} "${name}" (ID: ${id})`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "border-2 border-red-200 rounded-lg shadow-xl",
        confirmButton: "bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md",
        cancelButton: "bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md",
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(id).unwrap(); // Call delete API
        Swal.fire({
          title: "Deleted!",
          text: `${type.charAt(0).toUpperCase() + type.slice(1)} "${name}" has been removed.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch(); // Refresh list after delete
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: `Failed to delete ${type}. Please try again.`,
          icon: "error",
        });
      }
    }
  };

  // Pagination Controls
  const goToNextPage = () => {
    if (meta && page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  // Handle loading/error
  if (isLoading) return <TableSkeleton />;
  if (isError) return <div className="p-6 text-red-500 text-center">Failed to load users.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white">
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        <Button variant="outline" size="icon" className="border-gray-300">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content - Two Columns */}
      <div className="p-6 flex flex-col lg:flex-row gap-6">
        
        {/* Teachers Table */}
        <Card className="bg-white border border-blue-300 shadow-sm w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-gray-900 text-xl font-bold">
              Teachers ({teachers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="px-4 py-3 text-left text-sm font-semibold">No.</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.length > 0 ? (
                    teachers.map((teacher, index) => (
                      <tr key={teacher.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{(page - 1) * limit + index + 1}</td>
                        <td className="px-4 py-3 text-sm">{teacher.fullName}</td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete("teacher", teacher.id, teacher.fullName)}
                            className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 text-xs font-medium px-3 py-1"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-center text-gray-500">
                        No teachers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="bg-white border border-blue-300 shadow-sm w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-gray-900 text-xl font-bold">
              Students ({students.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="px-4 py-3 text-left text-sm font-semibold">Student ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length > 0 ? (
                    students.map((student, index) => (
                      <tr key={student.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{index + 1}</td>
                        <td className="px-4 py-3 text-sm">{student.fullName}</td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete("student", student.id, student.fullName)}
                            className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 text-xs font-medium px-3 py-1"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-center text-gray-500">
                        No students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pagination Controls */}
      <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-700">
            Rows per page:
          </label>
          <select
            id="pageSize"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1); // Reset to first page when changing limit
            }}
            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={page <= 1}
            className="px-4 py-2"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={page >= totalPages}
            className="px-4 py-2"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}