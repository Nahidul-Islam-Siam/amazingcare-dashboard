"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function RemindersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalReminders = 24; // as shown in image
  const remindersPerPage = 10;
  const totalPages = Math.ceil(totalReminders / remindersPerPage);

  // Mock data
  const reminders = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    date: "10/09/25",
    time: "02:30 AM",
    studentName: "Charli Falcon",
  }));

  // Get current page reminders
  const indexOfLastReminder = currentPage * remindersPerPage;
  const indexOfFirstReminder = indexOfLastReminder - remindersPerPage;
  const currentReminders = reminders.slice(indexOfFirstReminder, indexOfLastReminder);

  // Pagination handlers
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen max-w-5xl bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Reminders</h1>
      </div>

      {/* Reminder Cards */}
      <div className="space-y-3">
        {/* Header Row (Blue Bar) */}
        <div className="flex bg-blue-500 text-white rounded-t-lg px-4 py-2 text-sm font-semibold">
          <div className="w-1/3">Date</div>
          <div className="w-1/3">Time</div>
          <div className="w-1/3">Student Name</div>
        </div>

        {/* Reminder Cards */}
        {currentReminders.map((reminder) => (
          <div
            key={reminder.id}
            className="flex items-center justify-between bg-white border border-blue-300 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-1/3 text-sm text-gray-800">{reminder.date}</div>
            <div className="w-1/3 text-sm text-gray-800">{reminder.time}</div>
            <div className="w-1/3 flex items-center gap-2">
              <Avatar className="h-8 w-8 ring-1 ring-gray-200">
                <AvatarImage src="/avatars/shadcn.jpg" alt={reminder.studentName} />
                <AvatarFallback>{reminder.studentName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-800">{reminder.studentName}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-start gap-1 mt-6">
        <Button
          variant="outline"
          size="sm"
          className="px-3 py-2 border-gray-300"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
        </Button>

        {currentPage > 3 && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-2 border-gray-300"
              onClick={() => paginate(1)}
            >
              1
            </Button>
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
          <Button
            key={pageNum}
            size="sm"
            className={`px-3 py-2 ${
              currentPage === pageNum
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300'
            }`}
            onClick={() => paginate(pageNum)}
          >
            {pageNum}
          </Button>
        ))}

        {currentPage < totalPages - 2 && (
          <>
            <span className="px-2 text-sm text-gray-500">...</span>
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-2 border-gray-300"
              onClick={() => paginate(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          className="px-3 py-2 border-gray-300"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.646 14.646a.5.5 0 0 1 .708 0l6-6a.5.5 0 0 1 0-.708l-6-6a.5.5 0 0 1-.708.708L10.293 8 4.646 13.646a.5.5 0 0 1 0 .708z"/>
          </svg>
        </Button>
      </div>
    </div>
  );
}