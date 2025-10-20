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
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Mock data for events
const events = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  eventId: 12345 + i,
  eventName: [
    "Bible Study",
    "Prayer Meeting",
    "Baptism Service",
    "Thanksgiving",
    "Revival",
    "Church Anniversary",
    "Women's Fellowship",
    "Choir Concert",
  ][i % 8],
  location: [
    "Redeemed Christian Church",
    "Winners' Chapel",
    "Christ Embassy",
    "The Synagogue",
    "Cherubim and Seraphim",
    "Church of Christ",
    "Gospel Light Centre",
    "Faith Tabernacle",
  ][i % 8],
  requestMembers: Math.floor(Math.random() * 20) + 2,
  addedMembers: Math.floor(Math.random() * 30) + 10,
  date: "2025-02-13", // YYYY-MM-DD format
  time: ["22:30", "10:00", "14:00", "18:30", "09:15"][i % 5], // HH:MM format
}));

const ITEMS_PER_PAGE = 10;

export function EventTableList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("2025-02-13");
  const [selectedTime, setSelectedTime] = useState("");

  // ✅ Correct Filtering: Match ALL conditions
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchTerm === "" ||
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eventId.toString().includes(searchTerm);

    const matchesDate = selectedDate === "" || event.date === selectedDate;
    const matchesTime = selectedTime === "" || event.time === selectedTime;

    return matchesSearch && matchesDate && matchesTime;
  });

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1); // Go back to first page on filter
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

    if (currentPage > 3 && totalPages > 5) {
      pages.push(
        <span key="ellipsis-start" className="px-1 py-2 text-gray-500">
          ...
        </span>
      );
    }

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

    if (currentPage < totalPages - 2 && totalPages > 5) {
      pages.push(
        <span key="ellipsis-end" className="px-1 py-2 text-gray-500">
          ...
        </span>
      );
    }

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
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div>
        {/* Title */}
        <h2 className="text-lg font-semibold text-blue-600 mb-4">Event</h2>

        {/* Responsive Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          {/* Left Side: Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            {/* Date Pill */}
            <div className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-full bg-white hover:border-blue-400 transition-colors w-full sm:w-auto">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  handleFilterChange();
                }}
                className="text-sm text-gray-700 border-none outline-none bg-transparent cursor-pointer w-[90px]"
              />
            </div>

            {/* Search Bar */}
            <div className="relative flex items-center w-full sm:w-auto px-3 py-1.5 border border-gray-300 rounded-full bg-white hover:border-blue-400 transition-colors">
              <svg
                className="w-4 h-4 text-gray-400 mr-1"
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
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleFilterChange();
                }}
                className="text-sm text-gray-700 border-none outline-none bg-transparent cursor-pointer min-w-0 flex-1 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Add Event Button - Full width on mobile */}
          <Link href="/dashboard/event/add-event">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1.5 font-medium rounded-md w-full sm:w-auto">
              <span className="mr-2">+</span> Add Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar (Optional Addition) */}

      {/* Table */}
      <div className="rounded-md border border-gray-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-600 hover:bg-blue-600">
              <TableHead className="py-3 px-4 font-semibold text-white">
                Event Id
              </TableHead>
              <TableHead className="py-3 px-4 font-semibold text-white">
                Event Name
              </TableHead>
              <TableHead className="py-3 px-4 font-semibold text-white">
                Location
              </TableHead>
              <TableHead className="py-3 px-4 font-semibold text-white">
                Request Members
              </TableHead>
              <TableHead className="py-3 px-4 font-semibold text-white">
                Added Members
              </TableHead>
              <TableHead className="py-3 px-4 font-semibold text-white">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentEvents.length > 0 ? (
              currentEvents.map((event) => (
                <TableRow
                  key={event.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <TableCell className="py-3 px-4 text-gray-700">
                    {event.eventId}
                  </TableCell>
                  <TableCell className="py-3 px-4 font-medium text-gray-900">
                    {event.eventName}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">
                    {event.location}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">
                    {event.requestMembers}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">
                    {event.addedMembers}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4 text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem  className="text-blue-600 hover:bg-blue-50 cursor-pointer">
                          <Link href={`/dashboard/event/${event.id}`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 hover:bg-red-50 cursor-pointer">
                          Remove
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-green-600 hover:bg-green-50 cursor-pointer">
                          <Link href={`/dashboard/event/user/${event.id}`}>
                            View User List
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-gray-500"
                >
                  No events found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-1 mt-6">
        <Button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {renderPagination()}

        <Button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
