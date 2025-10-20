"use client";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";



interface User {
  userId: string;
  userName: string;
  email: string;
}

export function SubscribeUserTable({ users }: { users: User[] }) {






  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-900">
        Task Poster Management
      </h2>

      {/* Table */}
      <Card className="rounded-[12px] border border-yellow-300/40 bg-yellow-50 p-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#6B7280] ">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    User ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    User Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={index}
                    className=" hover:bg-yellow-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-900">{user.userId}</td>
                    <td className="py-3 px-4 text-gray-900">{user.userName}</td>
                    <td className="py-3 px-4 text-gray-900">{user.email}</td>
                
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}
