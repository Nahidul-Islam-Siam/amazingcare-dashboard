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
import Link from "next/link";
import Image from "next/image";

// Mock data for podcasts
const podcasts = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  date: "02/10/2025",
  topic: [
    "Jesus always with us",
    "The Power of Prayer",
    "Walking in Faith",
    "God's Love Never Fails",
    "Holy Spirit Guide Me",
    "The Resurrection Hope",
    "Abiding in Christ",
    "Grace and Mercy",
    "Faith That Overcomes",
    "Living Water",
  ][i % 10],
  host: "Father Lokhonga",
  thumbnail: `/images/audio.png`, // Cycle through 8 images
}));

const ITEMS_PER_PAGE = 10;

export function OthersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Filter podcasts based on search term
  const filteredPodcasts = podcasts.filter(
    (podcast) =>
      podcast.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      podcast.host.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredPodcasts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPodcasts = filteredPodcasts.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Reset to page 1 when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset pagination when searching
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
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
        <Link href="/dashboard/media" className="hover:text-blue-600">
          Media
        </Link>
        <span>›</span>
        <span className="font-medium text-gray-800">Others</span>
      </div>

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Date Filter */}
          <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-full bg-white hover:border-blue-400 transition-colors">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                ry="2"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="16"
                y1="2"
                x2="16"
                y2="6"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="8"
                y1="2"
                x2="8"
                y2="6"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="3"
                y1="10"
                x2="21"
                y2="10"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-sm text-gray-700">02/10/2025</span>
          </div>

          {/* Search Bar */}
          <div className="relative flex items-center w-full sm:w-[280px] px-3 py-1.5 border border-gray-300 rounded-full bg-white hover:border-blue-400 transition-colors">
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
              placeholder="Search podcasts..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="text-sm text-gray-700 border-none outline-none bg-transparent cursor-pointer w-full placeholder:text-gray-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="text-gray-400 hover:text-gray-600 ml-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Add Podcast Button */}
    <Link href="/dashboard/media/audio/add-others">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full sm:w-auto">
          <span className="mr-2">+</span> Add Others
        </Button>
    </Link>
      </div>

      {/* Table */}
      <div className="rounded-md border border-gray-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-600 hover:bg-blue-600">
              <TableHead className="py-3 px-4 font-semibold text-white">
                Date
              </TableHead>
              <TableHead className="py-3 px-4 font-semibold text-white">
                Topic
              </TableHead>
              <TableHead className="py-3 px-4 font-semibold text-white">
                Host
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPodcasts.length > 0 ? (
              currentPodcasts.map((podcast) => (
                <TableRow
                  key={podcast.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={podcast.thumbnail}
                        alt={podcast.topic}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                      <div className="text-sm text-gray-700">
                        {podcast.date}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 font-medium text-gray-900">
                    {podcast.topic}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">
                    {podcast.host}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-10 text-center text-gray-500"
                >
                  No podcasts found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1 mt-6">
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
