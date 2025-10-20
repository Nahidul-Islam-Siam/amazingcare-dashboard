"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // make sure shadcn/ui dialog installed

interface User {
  userId: string;
  userName: string;
  email: string;
}

export function TaskPosterTable({ users }: { users: User[] }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRemoveClick = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleConfirmRemove = () => {
    // your API logic to remove user
    console.log("Removed user:", selectedUser);
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

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
                <tr className="border-b border-gray-200">
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
                    className="border-b border-gray-100 hover:bg-yellow-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-900">{user.userId}</td>
                    <td className="py-3 px-4 text-gray-900">{user.userName}</td>
                    <td className="py-3 px-4 text-gray-900">{user.email}</td>
                    <td className="py-3 px-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => handleRemoveClick(user)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Popup */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-sm bg-white rounded-xl shadow-lg p-6 text-center">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Do you want to remove this user?
            </DialogTitle>
          </DialogHeader>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <Button
              className="bg-green-500 hover:bg-green-600 text-white px-6"
              onClick={handleConfirmRemove}
            >
              Yes
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white px-6"
              onClick={() => setIsDialogOpen(false)}
            >
              No
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
