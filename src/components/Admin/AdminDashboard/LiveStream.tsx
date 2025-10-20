"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import Swal from 'sweetalert2';

export default function AdminLiveStreamPage() {
  const liveStreams = [
    { id: 423, title: "Introduction to UI/UX Design", host: "Akash Saha", viewers: 196, status: "Live" },
    { id: 798, title: "Coding React Components", host: "Jenny Wilson", viewers: 816, status: "Live" },
    { id: 556, title: "Learn Python in 1 Hour", host: "Ralph Edwards", viewers: 130, status: "Live" },
    { id: 556, title: "Marketing Trends 2025", host: "Cody Fisher", viewers: 798, status: "Scheduled" },
    { id: 556, title: "Designing with Figma", host: "Darrell Steward", viewers: 357, status: "Scheduled" },
    { id: 556, title: "Machine Learning Demo", host: "Esther Howard", viewers: 423, status: "Completed" },
    { id: 556, title: "Becoming a Product Designer", host: "Annette Black", viewers: 177, status: "Completed" },
    { id: 556, title: "Effective Communication Skills", host: "Jacob Jones", viewers: 922, status: "Completed" },
    { id: 556, title: "Effective Communication Skills", host: "Devon Lane", viewers: 561, status: "Live" },
    { id: 556, title: "Effective Communication Skills", host: "Wade Warren", viewers: 826, status: "Scheduled" },
    { id: 556, title: "Effective Communication Skills", host: "Courtney Henry", viewers: 994, status: "Scheduled" },
    { id: 556, title: "Effective Communication Skills", host: "Robert Fox", viewers: 883, status: "Completed" },
    { id: 556, title: "Effective Communication Skills", host: "Arlene McCoy", viewers: 583, status: "Completed" },
    { id: 556, title: "Effective Communication Skills", host: "Bessie Cooper", viewers: 536, status: "Live" },
    { id: 556, title: "Effective Communication Skills", host: "Ronald Richards", viewers: 154, status: "Live" },
    { id: 556, title: "Effective Communication Skills", host: "Dianne Russell", viewers: 600, status: "Live" },
  ];

  // Optional: Add confirmation if you ever need “End Live” or “Cancel Scheduled”
  const handleAction = async (streamId: number, streamTitle: string, status: string) => {
    let actionText = "";
    if (status === "Live") {
      actionText = "End this live stream?";
    } else if (status === "Scheduled") {
      actionText = "Cancel this scheduled stream?";
    } else {
      actionText = "Mark as completed?";
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `${actionText} "${streamTitle}" (ID: ${streamId})`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'border-2 border-red-200 rounded-lg shadow-xl',
        confirmButton: 'bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md',
        cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md'
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      try {
        // Simulate API call here
        await Swal.fire({
          title: 'Success!',
          text: `Stream "${streamTitle}" status updated.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: 'border-2 border-green-200 rounded-lg shadow-xl'
          }
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update stream status.',
          icon: 'error',
          customClass: {
            popup: 'border-2 border-red-200 rounded-lg shadow-xl'
          }
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white">
        <h1 className="text-2xl font-bold text-gray-900">Live Status</h1>
        <Button variant="outline" size="icon" className="border-gray-300">
          <MoreHorizontal className="h-5 w-5" />
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
                  <th className="px-4 py-3 text-left text-sm font-semibold">Stream ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Stream Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Host</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Viewers</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {liveStreams.map((stream, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{stream.id}</td>
                    <td className="px-4 py-3 text-sm">{stream.title}</td>
                    <td className="px-4 py-3 text-sm">{stream.host}</td>
                    <td className="px-4 py-3 text-sm">{stream.viewers}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        onClick={() => handleAction(stream.id, stream.title, stream.status)}
                        className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full cursor-pointer transition-colors ${
                          stream.status === "Live"
                            ? "bg-red-100 text-red-800 hover:bg-red-200"
                            : stream.status === "Scheduled"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        }`}
                      >
                        {stream.status}
                      </span>
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