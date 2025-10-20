import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, MoreHorizontal, Check, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";


export default function LivePage() {
  const courses = Array(10)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      title: "Foundations of the Faith",
      teacher: "Charli Falcon",
      description: "Foundations of the Faith helps yo...",
      lessons: 34,
      price: 19,
      quizzes: i % 3 !== 0,
      assignment: i % 4 !== 0,
      qa: i % 5 !== 0,
      action: i % 2 === 0,
    }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h1 className="text-2xl font-bold">All Live</h1>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              title: "Total Revenue",
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

        {/* Add Course Button */}
        <Link href="/dashboard/live/add-live" className="flex justify-end mb-6">
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

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Teacher Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Lesson No.
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Price
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Quizzes
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Assignment
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Q&A
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{course.title}</td>
                    <td className="px-4 py-3 text-sm">{course.teacher}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {course.description}
                    </td>
                    <td className="px-4 py-3 text-sm">{course.lessons}</td>
                    <td className="px-4 py-3 text-sm">${course.price}</td>
                    <td className="px-4 py-3 text-center">
                      {course.quizzes ? (
                        <Check size={20} className="text-green-500 mx-auto" />
                      ) : (
                        <X size={20} className="text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {course.assignment ? (
                        <Check size={20} className="text-green-500 mx-auto" />
                      ) : (
                        <X size={20} className="text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {course.qa ? (
                        <Check size={20} className="text-green-500 mx-auto" />
                      ) : (
                        <X size={20} className="text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {course.action && (
                          <button className="text-blue-600 hover:text-blue-800 text-xs font-semibold">
                            Update
                          </button>
                        )}
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-start gap-2 mt-6">
          <button className="px-3 py-2 text-sm border rounded hover:bg-gray-50">
            ←
          </button>
          <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded font-semibold">
            1
          </button>
          <button className="px-3 py-2 text-sm border rounded hover:bg-gray-50">
            2
          </button>
          <span className="px-2 text-sm text-gray-500">...</span>
          <button className="px-3 py-2 text-sm border rounded hover:bg-gray-50">
            9
          </button>
          <button className="px-3 py-2 text-sm border rounded hover:bg-gray-50">
            10
          </button>
          <button className="px-3 py-2 text-sm border rounded hover:bg-gray-50">
            →
          </button>
        </div>
      </div>
    </div>
  );
}
