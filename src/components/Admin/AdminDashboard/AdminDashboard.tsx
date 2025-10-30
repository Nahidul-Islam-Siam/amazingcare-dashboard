"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardStats, TeacherDashboardData, useGetTeacherDashboardDataQuery } from "@/redux/features/superAdmin/dashboardApi";
import TableSkeleton from "@/lib/Loader";

export default function AdminDashboard() {
  const { data: apiData, isLoading, error } = useGetTeacherDashboardDataQuery();

  // Handle loading and error states
  if (isLoading) return <TableSkeleton/>;
  if (error) return <div className="p-6 text-red-500">Error loading dashboard data.</div>;

  // Extract stats and data from the API response
  const stats: DashboardStats = apiData?.data?.stats || {
    totalRevenue: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalBookings: 0,
    totalUpcomingLiveSessions: 0,
  };
  const dashboardData: TeacherDashboardData = apiData?.data?.data || {
    month: "",
    dailyRevenue: [],
    latestUpcomingLiveSessions: [],
    courses: [],
    todaysRemaining: []
  };

  // Process revenue data for the chart (sum daily revenue by month)
  const revenueData = dashboardData.dailyRevenue ? dashboardData.dailyRevenue.map(day => ({
    month: day.day.toString(),
    revenue: day.amount
  })) : [];

  // Use courses from API as top courses
  const topCourses = dashboardData.courses || [];

  // Use latest upcoming live sessions as recent live
  const recentLive = dashboardData.latestUpcomingLiveSessions || [];

  // Extract today's reminder data
  const todaysReminder = dashboardData.todaysRemaining?.[0] || null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard overview</h1>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            title: "Total Revenue",
            value: `$${stats.totalRevenue.toFixed(2)}`,
            bg: "bg-[var(--brand-tints,#DDE7FE)]",
            border: "border-[var(--semi-brand,#398EFD)]",
          },
          {
            title: "Total Courses",
            value: stats.totalCourses,
            bg: "bg-white",
            border: "border-[var(--brand-tints,#DDE7FE)]",
          },
          {
            title: "Total Live",
            value: stats.totalUpcomingLiveSessions,
            bg: "bg-white",
            border: "border-[var(--brand-tints,#DDE7FE)]",
          },
          {
            title: "Total Consultation",
            value: stats.totalBookings,
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
        {/* Revenue Chart */}
        <div className="lg:col-span-1">
          <Card className="bg-[#DDE7FE] py-3">
            <CardHeader>
              <CardTitle className="text-gray-900 text-xl font-bold">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={revenueData}>
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
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Courses Table */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-1 border-[] h-full">
            <CardHeader>
              <CardTitle className=" text-gray-900 text-xl font-bold">Top Courses</CardTitle>
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
                    {topCourses.length > 0 ? (
                      topCourses.map((course) => (
                        <TableRow key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <TableCell className="py-3 text-gray-800">{course.name}</TableCell>
                          <TableCell className="py-3 text-gray-800">{course.teacherName || 'N/A'}</TableCell>
                          <TableCell className="py-3 text-gray-800">{course.totalLesson || 0}</TableCell>
                          <TableCell className="py-3 text-gray-800">${course.price.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="py-4 text-center text-gray-500">No courses available</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Live */}
        <div className="lg:col-span-1">
          <Card className=" border border-[var(--semi-brand,#398EFD)] bg-[var(--Grey,#EEE)] py-3">
            <CardHeader>
              <CardTitle className="text-gray-900 text-lg">Recent Live</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto pb-3">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-500 hover:bg-blue-500">
                      <TableHead className="text-white font-medium">Date</TableHead>
                      <TableHead className="text-white font-medium">Topic</TableHead>
                      <TableHead className="text-white font-medium">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentLive.length > 0 ? (
                      recentLive.map((live) => (
                        <TableRow key={live.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <TableCell className="py-3 text-gray-800 text-sm">{new Date(live.date).toLocaleDateString()}</TableCell>
                          <TableCell className="py-3 text-gray-800 text-sm">{live.title}</TableCell>
                          <TableCell className="py-3 text-gray-800 text-sm">${live.totalPrice.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="py-4 text-center text-gray-500">No upcoming live sessions</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Todays' Reminder */}
        <div className="lg:col-span-2">
          <Card className="bg-[#DDE7FE] border border-[#DDE7FE] rounded-[4px] py-8">
            <CardHeader>
              <CardTitle className="text-gray-900 text-lg">Todays&lsquo; Reminder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-6">
                {/* Time Box */}
                <div className="bg-[#2667FF]  text-white w-48 text-center">
                  <div className="px-4 py-2 text-lg font-normal bg-[#2667FF] ">
                    Time
                  </div>
                  <div className="px-4 py-2 text-lg font-normal bg-[#398EFD] ">
                    {todaysReminder ? todaysReminder.time : "N/A"}
                  </div>
                </div>
                {/* Student Name Box */}
                <div className="bg-[#2667FF]  text-white w-48 text-center">
                  <div className="px-4 py-2 text-lg font-normal bg-[#2667FF] ">
                    Student Name
                  </div>
                  <div className="px-4 py-2 text-lg font-normal bg-[#398EFD] ">
                    {todaysReminder ? `${todaysReminder.user.firstName} ${todaysReminder.user.lastName}` : "N/A"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}