"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function LivePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalLives = 24;
  const livesPerPage = 10;
  const totalPages = Math.ceil(totalLives / livesPerPage);

  // Mock live session data
  const lives = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    date: "10/09/25",
    topic: "Foundations of the Faith",
    duration: "30:00",
    action: true, // Always show delete for demo
  }));

  // Get current page lives
  const indexOfLastLive = currentPage * livesPerPage;
  const indexOfFirstLive = indexOfLastLive - livesPerPage;
  const currentLives = lives.slice(indexOfFirstLive, indexOfLastLive);

  // Pagination handlers
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h1 className="text-2xl font-bold">All Live</h1>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[
            {
              title: "Total Live",
              value: "24",
              bg: "bg-blue-100",
              border: "border-blue-300",
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
          <Link href="/dashboard/live/add-live">
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
          </Link>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Topic
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Meet
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentLives.map((live) => (
                  <tr key={live.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{live.date}</td>
                    <td className="px-4 py-3 text-sm">{live.topic}</td>
                    <td className="px-4 py-3 text-sm">{live.duration}</td>
                    <td className="px-4 py-3 text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white  hover:text-blue-800"
                      >
                        Join
                      </Button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => {
                          import("sweetalert2").then(({ default: Swal }) => {
                            Swal.fire({
                              title: "Are you sure?",
                              text: `Do you want to delete Live Session #${live.id}? This action cannot be undone.`,
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Yes, delete it!",
                              cancelButtonText: "Cancel",
                              confirmButtonColor: "#E20000",
                              reverseButtons: true,
                              customClass: {
                                popup:
                                  "border-2 border-red-100 rounded-lg shadow-xl",
                                confirmButton: "bg-red-600 hover:bg-red-700",
                              },
                            }).then((result) => {
                              if (result.isConfirmed) {
                                // Simulate deletion
                                Swal.fire({
                                  icon: "success",
                                  title: "Deleted!",
                                  text: `Live Session #${live.id} has been deleted successfully.`,
                                  timer: 2000,
                                  timerProgressBar: true,
                                  showConfirmButton: false,
                                  background: "#fff",
                                  color: "#000",
                                });

                                // Here you can also:
                                // - Update state to remove item
                                // - Call API: fetch(`/api/live/${live.id}`, { method: 'DELETE' })
                              }
                            });
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M4.00065 12.6667C4.00065 13.4 4.60065 14 5.33398 14H10.6673C11.4007 14 12.0007 13.4 12.0007 12.6667V4.66667H4.00065V12.6667ZM12.6673 2.66667H10.334L9.66732 2H6.33398L5.66732 2.66667H3.33398V4H12.6673V2.66667Z"
                            fill="#E20000"
                          />
                        </svg>
                      </button>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
            </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M4.646 14.646a.5.5 0 0 1 .708 0l6-6a.5.5 0 0 1 0-.708l-6-6a.5.5 0 0 1-.708.708L10.293 8 4.646 13.646a.5.5 0 0 1 0 .708z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
