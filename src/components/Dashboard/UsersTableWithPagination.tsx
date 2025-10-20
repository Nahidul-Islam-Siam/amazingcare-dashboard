/* eslint-disable @typescript-eslint/no-explicit-any */
 
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DashboardUser } from "@/redux/features/dashboard/dashboardApi";
import Link from "next/link";
import Swal from "sweetalert2";
import { useDeleteUserMutation } from "@/redux/features/dashboard/usersApi";


interface UsersTableWithPaginationProps {
  data: DashboardUser[]; // ✅ pass an array of DashboardUser
  refetch: () => void
}

export default function UsersTableWithPagination({ data, refetch }: UsersTableWithPaginationProps) {
  // fall back to [] if no data
  const users: DashboardUser[] = data && data.length > 0 ? data : [];


    const [deleteUser] = useDeleteUserMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default: 10 items per page

  // Pagination logic
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = Number(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };


const handleDelete = (id: string, email: string) => {
  Swal.fire({
    title: "Delete user?",
    text: `This will permanently delete ${email}.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    reverseButtons: true,
    focusCancel: true,
    showLoaderOnConfirm: true,
    allowOutsideClick: () => !Swal.isLoading(),
    preConfirm: async () => {
      try {
        const res = await deleteUser(id).unwrap();

        // if API returns success=false, surface it as a validation error
        if (!res?.success) {
          throw new Error(res?.message || "Delete failed");
        }
        return res; // becomes result.value below
      } catch (err: any) {
        // show inline error in the same modal (no closing)
        Swal.showValidationMessage(
          err?.data?.message || err?.message || "Something went wrong. Please try again."
        );
        // rethrow so SweetAlert keeps the confirm disabled until corrected
        throw err;
      }
    },
  }).then(async (result) => {
    if (result.isConfirmed && result.value) {
      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: result.value.message || "User deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
      refetch();
    }
  });
};

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">New Users</h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#F1D9F2]">
            <TableRow>
              <TableHead className="px-4 py-3 text-[#585C66] font-medium text-center rounded-tl-lg">
                ID
              </TableHead>
              <TableHead className="px-4 py-3 text-[#585C66] font-medium text-center">
                User Name
              </TableHead>
              <TableHead className="px-4 py-3 text-[#585C66] font-medium text-center">
                Email
              </TableHead>
              <TableHead className="px-4 py-3 text-[#585C66] font-medium text-center">
                Status
              </TableHead>
              <TableHead className="px-4 py-3 text-[#585C66] font-medium text-center rounded-tr-lg">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-t border-b border-gray-100 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="px-8 py-3 font-medium text-gray-600 text-center">
                    #{user.id.toString().slice(-6).padStart(6, "0")}
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium text-center">
                    {user.firstName || user.lastName
                      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`
                      : "N/A"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 text-center">{user.email}</TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-6 py-2 text-xs font-medium rounded-lg border ${
                        user.profileImage
                          ? "bg-[#9E00A766] text-white hover:bg-white hover:text-[#9E00A766]"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.profileImage ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem >
                          <Link href={`/dashboard/profile/${user.id}`}>View User</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-[#E64C19]"
                          onClick={() => handleDelete(user.id, user.email)}
                        >
                    Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-gray-500">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>Showing</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>per page</span>
        </div>

        <div>
          Showing {users.length === 0 ? 0 : startIndex + 1} to{" "}
          {Math.min(startIndex + itemsPerPage, users.length)} of {users.length} records
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {"<"}
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant="outline"
              size="icon"
              className={`h-8 w-8 font-bold ${
                currentPage === page
                  ? "bg-[#9E00A7] text-white border-[#9E00A7]"
                  : "border-[#9E00A7] text-purple-700"
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {">"}
          </Button>
        </div>
      </div>
    </div>
  );
}
