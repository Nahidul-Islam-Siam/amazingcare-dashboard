/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { ChevronLeft, ChevronRight, MoreVertical, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for members
const members = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  userId: 12345 + i,
  userName: "Wade Warren",
  email: "georgia.young@example.com",
}));

const ITEMS_PER_PAGE = 10;

export function MembersList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter members based on search term
  const filteredMembers = members.filter(
    (member) =>
      member.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.userId.toString().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Generate pagination items with ellipsis
  const renderPagination = () => {
    const pages = [];

    // Always show page 1
    pages.push(
      <Button
        key={1}
        variant={currentPage === 1 ? "default" : "ghost"}
        size="icon"
        onClick={() => goToPage(1)}
        className={`h-8 w-8 ${
          currentPage === 1
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        1
      </Button>
    );

    // Add ellipsis if current page is far from start
    if (currentPage > 3 && totalPages > 5) {
      pages.push(
        <span key="ellipsis-start" className="px-1 py-2 text-gray-500">
          ...
        </span>
      );
    }

    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "ghost"}
          size="icon"
          onClick={() => goToPage(i)}
          className={`h-8 w-8 ${
            currentPage === i
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          {i}
        </Button>
      );
    }

    // Add ellipsis before last page if needed
    if (currentPage < totalPages - 2 && totalPages > 5) {
      pages.push(
        <span key="ellipsis-end" className="px-1 py-2 text-gray-500">
          ...
        </span>
      );
    }

    // Always show last page (if not already shown)
    if (totalPages > 1 && totalPages !== 1) {
      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "ghost"}
          size="icon"
          onClick={() => goToPage(totalPages)}
          className={`h-8 w-8 ${
            currentPage === totalPages
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Anexo Praia Búzios Members list
        </h2>
        <div className="relative">
          <Input
            placeholder="Search listing..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-[280px] border-gray-300 focus:border-blue-500"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0 h-6 w-6"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-600">
              <TableHead className="py-3 px-4 font-medium text-white">
                User ID
              </TableHead>
              <TableHead className="py-3 px-4 font-medium text-white">
                User Name
              </TableHead>
              <TableHead className="py-3 px-4 font-medium text-white">
                Email
              </TableHead>
              <TableHead className="py-3 px-4 font-medium text-white">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentMembers.map((member) => (
              <TableRow key={member.id} className="border-t hover:bg-gray-50">
                <TableCell className="py-3 px-4">{member.userId}</TableCell>
                <TableCell className="py-3 px-4 font-medium">
                  {member.userName}
                </TableCell>
                <TableCell className="py-3 px-4">{member.email}</TableCell>
                <TableCell className="py-3 px-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <span className="text-xs">⋯</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-24">
                      <DropdownMenuItem className="text-red-600 hover:bg-red-50 cursor-pointer">
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-1 mt-4">
        <Button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          variant="ghost"
          className="h-8 w-8 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {renderPagination()}

        <Button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="ghost"
          className="h-8 w-8 text-gray-600 hover:text-gray-800"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
