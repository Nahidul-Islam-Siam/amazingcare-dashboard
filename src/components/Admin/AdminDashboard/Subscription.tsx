/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import Swal from "sweetalert2";
import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SubsCriptionPage() {
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);

  // Mock subscription data matching your image
  const subscriptions = [
    { id: 10001, name: "Pro", price: "$500", postDate: "8/16/13" },
    { id: 10001, name: "Pro", price: "$500", postDate: "10/28/12" },
    { id: 10001, name: "Pro", price: "$500", postDate: "9/18/16" },
    { id: 10001, name: "Pro", price: "$500", postDate: "3/4/16" },
    { id: 10001, name: "Pro", price: "$500", postDate: "6/19/14" },
    { id: 10001, name: "Pro", price: "$500", postDate: "1/28/17" },
    { id: 10001, name: "Pro", price: "$500", postDate: "8/15/17" },
    { id: 10001, name: "Pro", price: "$500", postDate: "8/16/13" },
    { id: 10001, name: "Pro", price: "$500", postDate: "2/11/12" },
  ];

  // Handle Deny with SweetAlert
  const handleDeny = async (id: number, name: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to deny the subscription "${name}" (ID: ${id})`,
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
          text: `Subscription "${name}" has been denied.`,
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
          text: "Failed to deny subscription.",
          icon: "error",
          customClass: {
            popup: "border-2 border-red-200 rounded-lg shadow-xl",
          },
        });
      }
    }
  };

  // Show Edit Modal
  const openEditModal = (subscription: any) => {
    Swal.fire({
      title: `Edit Subscription #${subscription.id}`,
      html: `
        <div class="text-left p-4">
          <p><strong>Name:</strong> <input type="text" value="${subscription.name}" class="w-full border border-gray-300 rounded px-2 py-1 mt-1" /></p>
          <p><strong>Price:</strong> <input type="text" value="${subscription.price}" class="w-full border border-gray-300 rounded px-2 py-1 mt-1" /></p>
          <p><strong>Post Date:</strong> <input type="text" value="${subscription.postDate}" class="w-full border border-gray-300 rounded px-2 py-1 mt-1" /></p>
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
        Swal.fire("Updated!", "Subscription saved successfully.", "success");
      }
    });
  };

  // Open Details Modal
  const openDetailsModal = (subscription: any) => {
    setCurrentSubscription(subscription);
    setShowDetailsModal(true);
  };

  // Inline Modal Component (must be inside the parent component)
  const SubscriptionDetailsModal = () => {
    return (
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="p-0 max-w-[300px] bg-transparent border-none shadow-none">
          <div
            style={{
              background: "linear-gradient(135deg, #4A90E2, #2C6BDA)",
              color: "white",
              padding: "20px",
              borderRadius: "12px",
              textAlign: "center",
              fontFamily: "Arial, sans-serif",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              width: "100%",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              {/* Crown Icon */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="white"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5M2 12v5l10 5 10-5M2 12h20v5" />
                </svg>
              </div>

              {/* Monthly / Yearly Toggle */}
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  style={{
                    padding: "6px 12px",
                    background: "white",
                    color: "#2C6BDA",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Monthly
                </button>
                <button
                  style={{
                    padding: "6px 12px",
                    background: "transparent",
                    color: "white",
                    border: "1px solid white",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Yearly
                </button>
              </div>
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: "18px",
                margin: "0 0 10px 0",
                fontWeight: "bold",
              }}
            >
              Subscription
            </h3>

            {/* Features List */}
            <p
              style={{
                fontSize: "14px",
                margin: "0 0 10px 0",
                textAlign: "left",
                lineHeight: "1.5",
              }}
            >
              Includes<br />
              1. Can access all lessons<br />
              2. Can communicate with communities<br />
              3. Can have one to one session<br />
              4. Can able to access course file
            </p>

            {/* Price */}
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginTop: "20px",
              }}
            >
              {currentSubscription?.price}.00
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white">
        <h1 className="text-2xl font-bold text-gray-900">
          Subscription Management
        </h1>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-[var(--brand-tints,#DDE7FE)] border-[var(--semi-brand,#398EFD)]">
            <CardContent className="py-8 text-center">
              <p className="text-lg font-medium text-gray-700 mb-1">
                Total Subscription
              </p>
              <p className="text-xl font-bold text-gray-900">24</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-row gap-2 justify-end">
          {/* Add Subscription Button */}
          <Link href="/admin/subscriptions/subscription-users" className="flex justify-end mb-6">
            <Button variant={"destructive"} className="">
              See Subscription Users
            </Button>
          </Link>

          <Link href="/admin/subscriptions/add-subscription" className="flex justify-end mb-6">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
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
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
                <path
                  d="M12 8V16M16 12H8"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
              </svg>
              Add Subscriptions
            </Button>
          </Link>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Subscription ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Post Date
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{sub.id}</td>
                    <td className="px-4 py-3 text-sm">{sub.name}</td>
                    <td className="px-4 py-3 text-sm">{sub.price}</td>
                    <td className="px-4 py-3 text-sm">{sub.postDate}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
                              <MoreHorizontal size={18} />
                            </button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem onClick={() => openEditModal(sub)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeny(sub.id, sub.name)}>
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDetailsModal(sub)}>
                              Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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

        {/* Render the Details Modal */}
        <SubscriptionDetailsModal />
      </div>
    </div>
  );
}