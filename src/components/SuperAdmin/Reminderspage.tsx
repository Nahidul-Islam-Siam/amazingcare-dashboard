"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export default function RemindersPage() {
  // Mock data matching your image
  const reminders = Array(10)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      date: "10/09/25",
      time: "02:30 AM",
      studentName: "Charli Falcon",
    }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white">
        <h1 className="text-2xl font-bold text-gray-900">All Reminders</h1>
        <Button variant="outline" size="icon" className="border-gray-300">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Table */}
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Student Name</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reminders.map((reminder) => (
                  <tr key={reminder.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{reminder.date}</td>
                    <td className="px-4 py-3 text-sm">{reminder.time}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 ring-1 ring-gray-200">
                          <AvatarImage src="/avatars/shadcn.jpg" alt={reminder.studentName} />
                          <AvatarFallback>{reminder.studentName.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{reminder.studentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={18} />
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
          <Button variant="outline" size="sm" className="px-3 py-2">
            ←
          </Button>
          <Button size="sm" className="px-3 py-2 bg-blue-600 text-white font-semibold">
            1
          </Button>
          <Button variant="outline" size="sm" className="px-3 py-2">
            2
          </Button>
          <span className="px-2 text-sm text-gray-500">...</span>
          <Button variant="outline" size="sm" className="px-3 py-2">
            9
          </Button>
          <Button variant="outline" size="sm" className="px-3 py-2">
            10
          </Button>
          <Button variant="outline" size="sm" className="px-3 py-2">
            →
          </Button>
        </div>
      </div>
    </div>
  );
}