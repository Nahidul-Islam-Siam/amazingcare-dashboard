"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

// Mock Data — Matched to your image
const donationData = [
  { month: "1", amount: 70 },
  { month: "2", amount: 60 },
  { month: "3", amount: 110 },
  { month: "4", amount: 75 },
  { month: "5", amount: 70 },
  { month: "6", amount: 80 },
  { month: "7", amount: 45 },
  { month: "8", amount: 65 },
  { month: "9", amount: 90 },
  { month: "10", amount: 80 },
];

const topCourses = [
  { id: 1, title: "Faith", teacher: "Williams", lessons: 34, price: "$19" },
  { id: 2, title: "Faith", teacher: "Williams", lessons: 34, price: "$19" },
  { id: 3, title: "Faith", teacher: "Williams", lessons: 34, price: "$19" },
  { id: 4, title: "Faith", teacher: "Williams", lessons: 34, price: "$19" },
  { id: 5, title: "Faith", teacher: "Williams", lessons: 34, price: "$19" },
  { id: 6, title: "Faith", teacher: "Williams", lessons: 34, price: "$19" },
  { id: 7, title: "Faith", teacher: "Williams", lessons: 34, price: "$19" },
  { id: 8, title: "Faith", teacher: "Williams", lessons: 34, price: "$19" },
  { id: 9, title: "Faith", teacher: "Williams", lessons: 34, price: "$19" },
  { id: 10, title: "Faith", teacher: "Williams", lessons: 34, price: "$19" },
];

const teachers = [
  { id: 423, name: "Jenny Wilson", action: "Delete" },
  { id: 708, name: "Cody Fisher", action: "Delete" },
  { id: 556, name: "Albert Flores", action: "-" },
];

const students = [
  { id: 45483, name: "Jaguar, Tomato", action: "Delete" },
  { id: 98380, name: "Cody Fisher", action: "Delete" },
  { id: 52152, name: "Mole, Persimmon", action: "-" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard overview</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <Settings className="w-5 h-5" />
          <span>Admin</span>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            title: "Total Donations",
            value: "$1248",
            bg: "bg-[var(--brand-tints,#DDE7FE)]",
            border: "border-[var(--semi-brand,#398EFD)]",
          },
          {
            title: "Total Courses",
            value: "68",
            bg: "bg-white",
            border: "border-[var(--brand-tints,#DDE7FE)]",
          },
          {
            title: "Total Students",
            value: "24",
            bg: "bg-white",
            border: "border-[var(--brand-tints,#DDE7FE)]",
          },
          {
            title: "Total Teachers",
            value: "12",
            bg: "bg-white",
            border: "border-[var(--brand-tints,#DDE7FE)]",
          },
        ].map((card, index) => (
          <Card key={index} className={`${card.bg} ${card.border} border`}>
            <CardContent className="py-8 text-center">
              <p className="text-lg font-medium text-gray-700 mb-1">{card.title}</p>
              <p className="text-xl font-bold text-gray-900">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Donations Chart */}
        <div className="lg:col-span-1">
          <Card className="bg-[#DDE7FE] border-[var(--semi-brand,#398EFD)]">
            <CardHeader>
              <CardTitle className="text-gray-900 text-xl font-bold">Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={donationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                    cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                  />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Courses Table */}
        <div className="lg:col-span-2">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 text-xl font-bold">Top Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-500 hover:bg-blue-500">
                      <TableHead className="text-white font-medium">Title</TableHead>
                      <TableHead className="text-white font-medium">Teacher Name</TableHead>
                      <TableHead className="text-white font-medium">No. of Lesson</TableHead>
                      <TableHead className="text-white font-medium">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topCourses.map((course) => (
                      <TableRow key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <TableCell className="py-3 text-gray-800">{course.title}</TableCell>
                        <TableCell className="py-3 text-gray-800">{course.teacher}</TableCell>
                        <TableCell className="py-3 text-gray-800">{course.lessons}</TableCell>
                        <TableCell className="py-3 text-gray-800">{course.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teachers Table */}
        <div className="lg:col-span-1">
          <Card className="bg-[#DDE7FE] border-[var(--semi-brand,#398EFD)]">
            <CardHeader>
              <CardTitle className="text-gray-900 text-xl font-bold">Teachers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-500 hover:bg-blue-500">
                      <TableHead className="text-white font-medium">Teacher ID</TableHead>
                      <TableHead className="text-white font-medium">Teacher Name</TableHead>
                      <TableHead className="text-white font-medium">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map((teacher) => (
                      <TableRow key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <TableCell className="py-3 text-gray-800">{teacher.id}</TableCell>
                        <TableCell className="py-3 text-gray-800">{teacher.name}</TableCell>
                        <TableCell className="py-3 text-center">
                          {teacher.action === "Delete" ? (
                            <Button variant="outline" size="sm" className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100">
                              Delete
                            </Button>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students Table */}
        <div className="lg:col-span-2">
          <Card className="bg-[#DDE7FE] border-[var(--semi-brand,#398EFD)]">
            <CardHeader>
              <CardTitle className="text-gray-900 text-xl font-bold">Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-500 hover:bg-blue-500">
                      <TableHead className="text-white font-medium">Student ID</TableHead>
                      <TableHead className="text-white font-medium">Student Name</TableHead>
                      <TableHead className="text-white font-medium">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <TableCell className="py-3 text-gray-800">{student.id}</TableCell>
                        <TableCell className="py-3 text-gray-800">{student.name}</TableCell>
                        <TableCell className="py-3 text-center">
                          {student.action === "Delete" ? (
                            <Button variant="outline" size="sm" className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100">
                              Delete
                            </Button>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}