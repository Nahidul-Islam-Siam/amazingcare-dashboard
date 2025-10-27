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
import { useGetAllSubscriptionPlansQuery } from "@/redux/features/superAdmin/subscriptionPlanApi";

// Define Subscription Plan Type (can be moved to types/)
type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: "MONTHLY" | "YEARLY";
  active: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
};

export default function SubsCriptionPage() {
  const { data, isLoading, isError } = useGetAllSubscriptionPlansQuery({});
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionPlan | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const subscriptionPlans: SubscriptionPlan[] = data?.data || [];

  // Handle Delete (Deny)
  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${name}" subscription plan?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "border-2 border-red-200 rounded-lg shadow-xl",
        confirmButton: "bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md",
        cancelButton: "bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md",
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Deleted!",
          text: `Subscription "${name}" has been removed.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete subscription.",
          icon: "error",
        });
      }
    }
  };

  // Open Edit Modal (basic example)
  const openEditModal = (plan: SubscriptionPlan) => {
    Swal.fire({
      title: `Edit: ${plan.name}`,
      html: `
        <div class="text-left p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Name</label>
            <input type="text" id="name" value="${plan.name}" class="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Price (${plan.currency})</label>
            <input type="number" id="price" step="0.01" value="${plan.price}" class="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Interval</label>
            <select id="interval" class="w-full border border-gray-300 rounded px-3 py-2">
              <option value="MONTHLY" ${plan.interval === "MONTHLY" ? "selected" : ""}>Monthly</option>
              <option value="YEARLY" ${plan.interval === "YEARLY" ? "selected" : ""}>Yearly</option>
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById("name") as HTMLInputElement).value;
        const price = parseFloat((document.getElementById("price") as HTMLInputElement).value);
        const interval = (document.getElementById("interval") as HTMLSelectElement).value as "MONTHLY" | "YEARLY";
        return { name, price, interval };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Updated!", "Subscription plan has been saved.", "success");
      }
    });
  };

  // Open Details Modal
  const openDetailsModal = (plan: SubscriptionPlan) => {
    setCurrentSubscription(plan);
    setShowDetailsModal(true);
  };

  // Inline Modal Component
  const SubscriptionDetailsModal = () => {
    if (!currentSubscription) return null;

    return (
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="p-0 max-w-[320px] bg-transparent border-none shadow-none">
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5M2 12v5l10 5 10-5M2 12h20v5" />
                </svg>
              </div>

              {/* Monthly / Yearly Toggle */}
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  style={{
                    padding: "6px 12px",
                    background: currentSubscription.interval === "MONTHLY" ? "white" : "transparent",
                    color: currentSubscription.interval === "MONTHLY" ? "#2C6BDA" : "white",
                    border: currentSubscription.interval === "MONTHLY" ? "none" : "1px solid white",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Monthly
                </button>
                <button
                  style={{
                    padding: "6px 12px",
                    background: currentSubscription.interval === "YEARLY" ? "white" : "transparent",
                    color: currentSubscription.interval === "YEARLY" ? "#2C6BDA" : "white",
                    border: currentSubscription.interval === "YEARLY" ? "none" : "1px solid white",
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
            <h3 style={{ fontSize: "18px", margin: "0 0 10px 0", fontWeight: "bold" }}>{currentSubscription.name}</h3>

            {/* Features */}
            <p style={{ fontSize: "14px", margin: "0 0 10px 0", textAlign: "left", lineHeight: "1.5" }}>
              Includes:<br />
              {currentSubscription.features.map((feat, i) => (
                <span key={i}>
                  {i + 1}. {feat}
                  <br />
                </span>
              ))}
            </p>

            {/* Price */}
            <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "20px" }}>
              {currentSubscription.price.toFixed(2)} {currentSubscription.currency}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if (isLoading) return <div className="p-6 text-center">Loading subscription plans...</div>;
  if (isError) return <div className="p-6 text-red-500 text-center">Failed to load subscription plans.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white border-b">
        <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-[#DDE7FE] border-[#398EFD]">
            <CardContent className="py-8 text-center">
              <p className="text-lg font-medium text-gray-700 mb-1">Total Subscriptions</p>
              <p className="text-xl font-bold text-gray-900">{subscriptionPlans.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-2 justify-end mb-6">
          <Link href="/admin/subscriptions/subscription-users">
            <Button variant="destructive">See Subscription Users</Button>
          </Link>
          <Link href="/admin/subscriptions/add-subscription">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M2.5 21.5H21.5V2.5H2.50001L2.5 21.5Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
                <path d="M12 8V16M16 12H8" stroke="white" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
              Add Subscription
            </Button>
          </Link>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Interval</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {subscriptionPlans.length > 0 ? (
                  subscriptionPlans.map((plan, index) => (
                    <tr key={plan.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium">{plan.name}</td>
                      <td className="px-4 py-3 text-sm">{plan.price.toFixed(2)} {plan.currency}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            plan.interval === "MONTHLY"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {plan.interval}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                              <MoreHorizontal size={18} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem onClick={() => openEditModal(plan)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(plan.id, plan.name)} className="text-red-600">
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDetailsModal(plan)}>Details</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No subscription plans found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Optional: Pagination Placeholder */}
        <div className="flex justify-start mt-6 text-sm text-gray-500">
          Showing {subscriptionPlans.length} plans
        </div>

        {/* Render Modal */}
        <SubscriptionDetailsModal />
      </div>
    </div>
  );
}