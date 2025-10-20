"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, Check, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Swal from 'sweetalert2';

export default function AdminCoursesPage() {
  const courses = [
    { id: 423, name: "Digital Illustration Masterclass", enrolled: 453, teacher: "Annette Black" },
    { id: 798, name: "Cybersecurity Fundamentals", enrolled: 738, teacher: "Cameron Williamson" },
    { id: 556, name: "Python for Beginners to Advanced", enrolled: 177, teacher: "Albert Flores" },
    { id: 556, name: "Digital Marketing Mastery", enrolled: 922, teacher: "Floyd Miles" },
    { id: 556, name: "Email & Performance Marketing", enrolled: 647, teacher: "Esther Howard" },
    { id: 556, name: "Creative Problem Solving", enrolled: 429, teacher: "Cody Fisher" },
    { id: 556, name: "Effective Communication Skills", enrolled: 130, teacher: "Kristin Watson" },
    { id: 556, name: "Effective Communication Skills", enrolled: 130, teacher: "Kristin Watson" },
    { id: 556, name: "Effective Communication Skills", enrolled: 130, teacher: "Kristin Watson" },
    { id: 556, name: "Effective Communication Skills", enrolled: 130, teacher: "Kristin Watson" },
    { id: 556, name: "Effective Communication Skills", enrolled: 130, teacher: "Kristin Watson" },
    { id: 556, name: "Effective Communication Skills", enrolled: 130, teacher: "Kristin Watson" },
    { id: 556, name: "Effective Communication Skills", enrolled: 130, teacher: "Kristin Watson" },
    { id: 556, name: "Effective Communication Skills", enrolled: 130, teacher: "Kristin Watson" },
    { id: 556, name: "Effective Communication Skills", enrolled: 130, teacher: "Kristin Watson" },
  ];

  const handleDelete = async (courseId: number, courseName: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${courseName}" (ID: ${courseId})`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
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
        // Simulate API call or trigger real delete mutation here
        // await deleteCourseMutation(courseId).unwrap();

        await Swal.fire({
          title: 'Deleted!',
          text: `Course "${courseName}" has been deleted.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: 'border-2 border-green-200 rounded-lg shadow-xl'
          }
        });

        // Optional: refetch data or update state
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete course. Please try again.',
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
        <h1 className="text-2xl font-bold text-gray-900">Course List</h1>
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
                  <th className="px-4 py-3 text-left text-sm font-semibold">Course ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Course Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Enrolled</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Teacher</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{course.id}</td>
                    <td className="px-4 py-3 text-sm">{course.name}</td>
                    <td className="px-4 py-3 text-sm">{course.enrolled}</td>
                    <td className="px-4 py-3 text-sm">{course.teacher}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(course.id, course.name)}
                        className="bg-red-200 hover:bg-red-300 text-red-700 text-xs font-medium px-3 py-1"
                      >
                        Delete
                      </Button>
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