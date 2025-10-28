/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Swal from "sweetalert2";
import { useState } from "react";
import { useGetDonationListQuery } from "@/redux/features/superAdmin/donationApi";

export default function DonationPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, error, isLoading } = useGetDonationListQuery({ page, limit });

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading donations...</div>;
  }

  if (error || !data?.success) {
    return (
      <div className="p-6 text-red-600">
        Failed to load donations. {error && JSON.stringify(error)}
      </div>
    );
  }

  const donations = data.data;

  // Total donations amount
  const totalDonations = donations
    .reduce((sum, d) => sum + Number(d.amount || 0), 0)
    .toFixed(2);

  // Handle Deny (optional)
  const handleDeny = async (donation: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to deny the donation from "${donation.fullName}"`,
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
      Swal.fire({
        title: "Denied!",
        text: `Donation from "${donation.fullName}" has been denied.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white">
        <h1 className="text-2xl font-bold text-gray-900">
          Donation Management
        </h1>
      </div>

      {/* Stats Card */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-300">
          <CardContent className="py-4 text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Total Donations
            </p>
            <p className="text-xl font-bold text-gray-900">${totalDonations}</p>
          </CardContent>
        </Card>
      </div>

      {/* Donations Table */}
      <div className="p-6 border rounded-lg overflow-hidden bg-white shadow-sm">
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
                <tr key={donation.donationId} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm">{donation.fullName}</td>
                  <td className="px-4 py-3 text-sm">{donation.email}</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(donation.donatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-green-600">
                    ${donation.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {data.meta.totalPages > 1 && (
        <div className="flex items-center justify-start gap-1 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-2"
          >
            ←
          </Button>
          {[...Array(data.meta.totalPages)].map((_, i) => (
            <Button
              key={i}
              size="sm"
              onClick={() => setPage(i + 1)}
              className={`px-3 py-2 ${page === i + 1 ? "bg-blue-600 text-white" : "border-gray-300"}`}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={page === data.meta.totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-2"
          >
            →
          </Button>
        </div>
      )}
    </div>
  );
}
