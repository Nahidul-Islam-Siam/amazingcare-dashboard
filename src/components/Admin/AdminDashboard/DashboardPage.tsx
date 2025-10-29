"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
// import { Settings } from "lucide-react";

import TableSkeleton from "@/lib/Loader";
import Image from "next/image";
import { Teacher, useGetDashboardDataQuery } from "@/redux/features/superAdmin/dashboardApi";
import { useState } from "react";

// ✅ Fake Top Courses (unchanged)
const topCourses = [
  { id: 1, title: "Faith", teacher: "Williams", lessons: 34, price: "$19" },
  { id: 2, title: "Grace", teacher: "Johnson", lessons: 28, price: "$25" },
  { id: 3, title: "Hope", teacher: "Lee", lessons: 40, price: "$22" },
  { id: 4, title: "Love", teacher: "Martinez", lessons: 36, price: "$20" },
  { id: 5, title: "Peace", teacher: "Taylor", lessons: 30, price: "$18" },
];

export default function DashboardPage() {
  const { data, isLoading, isError } = useGetDashboardDataQuery();
  const [teacherPage, setTeacherPage] = useState(1);
  const [studentPage, setStudentPage] = useState(1);
  const itemsPerPage = 3;

  if (isLoading) return <TableSkeleton />;
  if (isError)
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load dashboard data. Please try again later.
      </div>
    );

  const dashboardStats = data?.data?.stats;
  const dashboardData = data?.data?.data;

  // ✅ Stats
  const stats = {
    totalDonation: dashboardStats?.totalDonation || 0,
    totalCourses: dashboardStats?.totalCourses || 0,
    totalStudents: dashboardStats?.totalStudents || 0,
    totalTeachers: dashboardStats?.totalTeachers || 0,
  };

  // ✅ Chart Data
  const donationChartData = dashboardData?.dailyDonations?.map((item) => ({
    day: item.day,
    amount: item.amount,
  }));

  // ✅ Teachers pagination
  const teachers = dashboardData?.teachers || [];
  const totalTeacherPages = Math.ceil(teachers.length / itemsPerPage);
  const displayedTeachers = teachers.slice(
    (teacherPage - 1) * itemsPerPage,
    teacherPage * itemsPerPage
  );

  // ✅ Students pagination
  const students = dashboardData?.students || [];
  const totalStudentPages = Math.ceil(students.length / itemsPerPage);
  const displayedStudents = students.slice(
    (studentPage - 1) * itemsPerPage,
    studentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
 
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            title: "Total Donations",
            value: `$${stats.totalDonation.toLocaleString()}`,
            bg: "bg-blue-100",
            border: "border-blue-300",
          },
          {
            title: "Total Courses",
            value: stats.totalCourses,
            bg: "bg-white",
            border: "border-gray-200",
          },
          {
            title: "Total Students",
            value: stats.totalStudents,
            bg: "bg-white",
            border: "border-gray-200",
          },
          {
            title: "Total Teachers",
            value: stats.totalTeachers,
            bg: "bg-white",
            border: "border-gray-200",
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

      {/* Donations Chart + Top Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Donations Chart */}
        <div className="lg:col-span-1">
          <Card className="bg-blue-50 border-blue-300">
            <CardHeader>
              <CardTitle className="text-gray-900 text-xl font-bold">
                Donations ({dashboardData?.month})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={donationChartData} barSize={10}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tick={{ fontSize: 12 }}
                    interval={2}
                    ticks={[1, 5, 10, 15, 20, 25, 30]}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) =>
                      value >= 1000 ? `${value / 1000}k` : value
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => [`$${value}`, "Amount"]}
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

        {/* Top Courses (Fake Data) */}
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
                      <TableHead className="text-white font-medium">Teacher</TableHead>
                      <TableHead className="text-white font-medium">Lessons</TableHead>
                      <TableHead className="text-white font-medium">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topCourses.map((course, index) => (
                      <TableRow
                        key={index+1 }
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
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

      {/* Teachers & Students */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teachers */}
        <div className="lg:col-span-1">
          <Card className="bg-blue-50 border-blue-300">
            <CardHeader>
              <CardTitle className="text-gray-900 text-xl font-bold">
                Teachers ({teachers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-500">
                    <TableHead className="text-white font-medium">ID</TableHead>
                    <TableHead className="text-white font-medium">Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedTeachers.map((teacher: Teacher, index) => (
                    <TableRow key={teacher.id} className="hover:bg-gray-50">
                      <TableCell className="py-3 text-sm text-gray-800">
                        {index +1}
                      </TableCell>
                      <TableCell className="py-3 text-sm font-medium text-gray-800 flex items-center gap-2">
                        {teacher.profileImage ? (
                          <Image
                            width={32}
                            height={32}
                            src={teacher.profileImage.trim()}
                            alt={teacher.fullName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                            {teacher.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                        )}
                        {teacher.fullName}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalTeacherPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTeacherPage((p) => Math.max(p - 1, 1))}
                    disabled={teacherPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-700">
                    Page {teacherPage} of {totalTeacherPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTeacherPage((p) => Math.min(p + 1, totalTeacherPages))}
                    disabled={teacherPage === totalTeacherPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Students */}
        <div className="lg:col-span-2">
          <Card className="bg-blue-50 border-blue-300">
            <CardHeader>
              <CardTitle className="text-gray-900 text-xl font-bold">
                Students ({students.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-500">
                    <TableHead className="text-white font-medium">ID</TableHead>
                    <TableHead className="text-white font-medium">Name</TableHead>
                    <TableHead className="text-white font-medium">Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedStudents.map((student, index) => (
                    <TableRow key={student.id} className="hover:bg-gray-50">
                      <TableCell className="py-3 text-sm text-gray-800">
                        {index +1}
                      </TableCell>
                      <TableCell className="py-3 text-sm font-medium text-gray-800 flex items-center gap-2">
                        {student.profileImage ? (
                          <Image
                            width={32}
                            height={32}
                            src={student.profileImage.trim()}
                            alt={student.fullName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                            {student.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                        )}
                        {student.fullName}
                      </TableCell>
                      <TableCell className="py-3 text-sm text-gray-600">
                        {student.email}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalStudentPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStudentPage((p) => Math.max(p - 1, 1))}
                    disabled={studentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-700">
                    Page {studentPage} of {totalStudentPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStudentPage((p) => Math.min(p + 1, totalStudentPages))}
                    disabled={studentPage === totalStudentPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
