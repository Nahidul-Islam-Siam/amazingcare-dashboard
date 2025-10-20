"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import Swal from 'sweetalert2';

export default function UsersPage() {
  // Mock Teachers Data
  const teachers = [
    { id: 423, name: "Jenny Wilson" },
    { id: 798, name: "Cody Fisher" },
    { id: 556, name: "Albert Flores" },
    { id: 556, name: "Albert Flores" },
    { id: 556, name: "Albert Flores" },
    { id: 556, name: "Albert Flores" },
    { id: 556, name: "Albert Flores" },
    { id: 556, name: "Albert Flores" },
    { id: 556, name: "Albert Flores" },
    { id: 556, name: "Albert Flores" },
    { id: 556, name: "Albert Flores" },
    { id: 556, name: "Albert Flores" },
    { id: 556, name: "Albert Flores" },
    { id: 556, name: "Albert Flores" },
    { id: 556, name: "Albert Flores" },
  ];

  // Mock Students Data
  const students = [
    { id: 45463, name: "Jaguar, Tomato" },
    { id: 98380, name: "Cody Fisher" },
    { id: 52152, name: "Mole, Persimmon" },
    { id: 52152, name: "Mole, Persimmon" },
    { id: 52152, name: "Mole, Persimmon" },
    { id: 52152, name: "Mole, Persimmon" },
    { id: 52152, name: "Mole, Persimmon" },
    { id: 52152, name: "Mole, Persimmon" },
    { id: 52152, name: "Mole, Persimmon" },
    { id: 52152, name: "Mole, Persimmon" },
    { id: 52152, name: "Mole, Persimmon" },
    { id: 52152, name: "Mole, Persimmon" },
    { id: 52152, name: "Mole, Persimmon" },
    { id: 52152, name: "Mole, Persimmon" },
    { id: 52152, name: "Mole, Persimmon" },
  ];

  // Delete Handler with SweetAlert
  const handleDelete = async (type: "teacher" | "student", id: number, name: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete this ${type} "${name}" (ID: ${id})`,
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
        // Simulate API call or trigger real mutation here
        await Swal.fire({
          title: 'Deleted!',
          text: `${type.charAt(0).toUpperCase() + type.slice(1)} "${name}" has been deleted.`,
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
          text: `Failed to delete ${type}. Please try again.`,
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
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        <Button variant="outline" size="icon" className="border-gray-300">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content - Two Columns */}
      <div className="p-6 flex flex-row gap-6 max-w-full" >
        
        {/* Teachers Table */}
        <Card className="bg-white border border-blue-300 shadow-sm w-full">
          <CardHeader>
            <CardTitle className="text-gray-900 text-xl font-bold">Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="px-4 py-3 text-left text-sm font-semibold">Teacher ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Teacher Name</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{teacher.id}</td>
                      <td className="px-4 py-3 text-sm">{teacher.name}</td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete("teacher", teacher.id, teacher.name)}
                          className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 text-xs font-medium px-3 py-1"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="bg-gray-50 border border-blue-300 shadow-sm w-full">
          <CardHeader>
            <CardTitle className="text-gray-900 text-xl font-bold">Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="px-4 py-3 text-left text-sm font-semibold">Student ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Student Name</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{student.id}</td>
                      <td className="px-4 py-3 text-sm">{student.name}</td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete("student", student.id, student.name)}
                          className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 text-xs font-medium px-3 py-1"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}