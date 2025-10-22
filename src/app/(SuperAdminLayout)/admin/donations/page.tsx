/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import Swal from "sweetalert2";
import { useState } from "react";
import Link from "next/link";

export default function SubsCriptionPage() {
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  // Mock donation data matching your image
  const donations = [
    { id: 10001, name: "Eleanor Pena", email: "georgia.young@example.com", date: "8/16/13", amount: "$500" },
    { id: 10001, name: "Albert Flores", email: "jackson.graham@example.com", date: "10/28/12", amount: "$500" },
    { id: 10001, name: "Kristin Watson", email: "tanya.hill@example.com", date: "9/18/16", amount: "$500" },
    { id: 10001, name: "Albert Flores", email: "tim.jennings@example.com", date: "3/4/16", amount: "$500" },
    { id: 10001, name: "Jacob Jones", email: "deanna.curtis@example.com", date: "6/19/14", amount: "$500" },
    { id: 10001, name: "Wade Warren", email: "wille.jennings@example.com", date: "1/28/17", amount: "$500" },
    { id: 10001, name: "Jerome Bell", email: "kenzi.lawson@example.com", date: "8/15/17", amount: "$500" },
    { id: 10001, name: "Guy Hawkins", email: "tanya.hill@example.com", date: "8/16/13", amount: "$500" },
    { id: 10001, name: "Robert Fox", email: "nathan.roberts@example.com", date: "2/11/12", amount: "$500" },
  ];

  // Total Donation Calculation
  const totalDonations = donations.reduce((sum, d) => {
    const num = parseFloat(d.amount.replace('$', ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0).toFixed(2);

  // Handle Deny (optional - keep for now)
  const handleDeny = async (id: number, name: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to deny the donation from "${name}" (ID: ${id})`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deny it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "border-2 border-red-200 rounded-lg shadow-xl",
        confirmButton:
          "bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md",
        cancelButton:
          "bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md",
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        await Swal.fire({
          title: "Denied!",
          text: `Donation from "${name}" has been denied.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: "border-2 border-green-200 rounded-lg shadow-xl",
          },
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to deny donation.",
          icon: "error",
          customClass: {
            popup: "border-2 border-red-200 rounded-lg shadow-xl",
          },
        });
      }
    }
  };

  // Show Edit Modal (optional placeholder)
  const openEditModal = (donation: any) => {
    Swal.fire({
      title: `Edit Donation #${donation.id}`,
      html: `
        <div class="text-left p-4">
          <p><strong>Name:</strong> <input type="text" value="${donation.name}" class="w-full border border-gray-300 rounded px-2 py-1 mt-1" /></p>
          <p><strong>Email:</strong> <input type="text" value="${donation.email}" class="w-full border border-gray-300 rounded px-2 py-1 mt-1" /></p>
          <p><strong>Date:</strong> <input type="text" value="${donation.date}" class="w-full border border-gray-300 rounded px-2 py-1 mt-1" /></p>
          <p><strong>Amount:</strong> <input type="text" value="${donation.amount}" class="w-full border border-gray-300 rounded px-2 py-1 mt-1" /></p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Save Changes",
      cancelButtonText: "Cancel",
      customClass: {
        popup:
          "rounded-lg shadow-xl border overflow-hidden max-h-[90vh] overflow-y-auto",
      },
      background: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Updated!", "Donation saved successfully.", "success");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white">
        <h1 className="text-2xl font-bold text-gray-900">
          Donation Management
        </h1>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Card — Updated to match image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-blue-50 border-blue-300">
            <CardContent className="py-4 text-center">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Total Donations
              </p>
              <p className="text-xl font-bold text-gray-900">${totalDonations}</p>
            </CardContent>
          </Card>
        </div>

       

        {/* Table — Updated headers and content to match image */}
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Donation ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    User Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    User Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{donation.id}</td>
                    <td className="px-4 py-3 text-sm">{donation.name}</td>
                    <td className="px-4 py-3 text-sm">{donation.email}</td>
                    <td className="px-4 py-3 text-sm">{donation.date}</td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-green-600">
                      {donation.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination — unchanged, matches image */}
        <div className="flex items-center justify-start gap-1 mt-6">
          <Button variant="outline" size="sm" className="px-3 py-2">
            ←
          </Button>
          <Button
            size="sm"
            className="px-3 py-2 bg-blue-600 text-white font-semibold"
          >
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