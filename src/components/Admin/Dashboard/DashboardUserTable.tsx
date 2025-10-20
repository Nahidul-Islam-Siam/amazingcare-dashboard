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
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Updated data to match User List structure
const users = Array.from({ length: 50 }, (_, i) => ({
  id: 12345,
  name: "Wade Warren",
  email: "georgia.young@example.com",
  phone: "017022554477",
  country: "Brazil",
}));

const ITEMS_PER_PAGE = 10;

export function DashboardUserTable() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = users.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div>
      {/* Header Title */}
      <div className="px-6 py-4 border-b bg-white">
        <h2 className="text-lg font-semibold text-gray-800">User List</h2>
      </div>

      {/* Table Container */}
      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        {/* Header Wrapper with Rounded Top Corners */}
        <div className="bg-white border-b border-[#CCC] rounded-t-[8px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#2662E6] ">
                <TableHead className="text-white py-3 px-4">User ID</TableHead>
                <TableHead className="text-white py-3 px-4">User Name</TableHead>
                <TableHead className="text-white py-3 px-4">Email</TableHead>
                <TableHead className="text-white py-3 px-4">Phone</TableHead>
                <TableHead className="text-white py-3 px-4">Country</TableHead>
                <TableHead className="text-white py-3 px-4 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user, index) => (
                <TableRow key={index} className="border-t">
                  <TableCell className="py-3 px-4">{user.id}</TableCell>
                  <TableCell className="py-3 px-4 font-medium">{user.name}</TableCell>
                  <TableCell className="py-3 px-4">{user.email}</TableCell>
                  <TableCell className="py-3 px-4">{user.phone}</TableCell>
                  <TableCell className="py-3 px-4">{user.country}</TableCell>
                  <TableCell className="py-3 px-4 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-red-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="22"
                        viewBox="0 0 18 22"
                        fill="none"
                      >
                        <path
                          d="M17 3C17.2652 3 17.5196 3.10536 17.7071 3.29289C17.8946 3.48043 18 3.73478 18 4C18 4.26522 17.8946 4.51957 17.7071 4.70711C17.5196 4.89464 17.2652 5 17 5H16L15.997 5.071L15.064 18.142C15.0281 18.6466 14.8023 19.1188 14.4321 19.4636C14.0619 19.8083 13.5749 20 13.069 20H4.93C4.42414 20 3.93707 19.8083 3.56688 19.4636C3.1967 19.1188 2.97092 18.6466 2.935 18.142L2.002 5.072L2 5H1C0.734784 5 0.48043 4.89464 0.292893 4.70711C0.105357 4.51957 0 4.26522 0 4C0 3.73478 0.105357 3.48043 0.292893 3.29289C0.48043 3.10536 0.734784 3 1 3H17ZM13.997 5H4.003L4.931 18H13.069L13.997 5ZM11 0C11.2652 0 11.5196 0.105357 11.7071 0.292893C11.8946 0.48043 12 0.734784 12 1C12 1.26522 11.8946 1.51957 11.7071 1.70711C11.5196 1.89464 11.2652 2 11 2H7C6.73478 2 6.48043 1.89464 6.29289 1.70711C6.10536 1.51957 6 1.26522 6 1C6 0.734784 6.10536 0.48043 6.29289 0.292893C6.48043 0.105357 6.73478 0 7 0H11Z"
                          fill="#2662E6"
                        />
                      </svg>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-1 border-t p-4">
          <Button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 bg-white text-[#2662E6] border-[#2662E6]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="icon"
                onClick={() => goToPage(page)}
                className={`h-8 w-8 ${
                  currentPage === page
                    ? "bg-[#2662E6] hover:bg-[#2662E6] text-white"
                    : ""
                }`}
              >
                {page}
              </Button>
            );
          })}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}