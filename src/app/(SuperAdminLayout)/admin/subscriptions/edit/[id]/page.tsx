/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Swal from "sweetalert2";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useGetSingleSubscriptionPlanQuery,
//   useUpdateSubscriptionPlanMutation,
} from "@/redux/features/superAdmin/subscriptionPlanApi";

// Shadcn Components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function EditSubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data, isLoading: isFetching, error } = useGetSingleSubscriptionPlanQuery({ id: id! }, { skip: !id });

//   const [updatePlan, { isLoading: isUpdating }] = useUpdateSubscriptionPlanMutation();

  const [formData, setFormData] = useState({
    subscriptionName: "",
    planPrice: "",
    billingCycle: "monthly", // "monthly" | "yearly"
    description: "", // one feature per line
    availabilityDate: "", // Format: YYYY-MM
  });

  // Pre-fill form when data is loaded
  useEffect(() => {
    if (data?.data) {
      const plan = data.data;
      setFormData({
        subscriptionName: plan.name,
        planPrice: String(plan.price),
        billingCycle: plan.interval === "YEARLY" ? "yearly" : "monthly",
        description: plan.features.join("\n"),
        availabilityDate: "", // Optional: set if backend supports startDate
      });
    }

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Not Found",
        text: "Could not load subscription plan.",
        confirmButtonText: "Go Back",
      }).then(() => {
        router.push("/admin/subscriptions");
      });
    }
  }, [data, error, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingToggle = (cycle: "monthly" | "yearly") => {
    setFormData((prev) => ({ ...prev, billingCycle: cycle }));
  };

  const handleMonthSelect = (date: Date | undefined) => {
    if (date) {
      const monthYear = format(date, "yyyy-MM");
      setFormData((prev) => ({ ...prev, availabilityDate: monthYear }));
    }
  };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!id) return;

//     // Validation
//     if (!formData.subscriptionName.trim()) {
//       Swal.fire({
//         icon: "error",
//         title: "Required",
//         text: "Subscription name is required!",
//         confirmButtonText: "Okay",
//       });
//       return;
//     }

//     const price = parseFloat(formData.planPrice);
//     if (!formData.planPrice || isNaN(price) || price < 0) {
//       Swal.fire({
//         icon: "error",
//         title: "Invalid Price",
//         text: "Please enter a valid price.",
//         confirmButtonText: "Fix It",
//       });
//       return;
//     }

//     const features = formData.description
//       .split("\n")
//       .map((line) => line.trim())
//       .filter((line) => line.length > 0);

//     if (features.length === 0) {
//       Swal.fire({
//         icon: "error",
//         title: "Missing Features",
//         text: "Please add at least one feature for this plan.",
//         confirmButtonText: "Add Feature",
//       });
//       return;
//     }

//     const payload = {
//       id,
//       name: formData.subscriptionName,
//       price,
//       interval: formData.billingCycle === "monthly" ? ("MONTHLY" as const) : ("YEARLY" as const),
//       features,
//     };

//     try {
//       const result = await updatePlan(payload).unwrap();

//       Swal.fire({
//         icon: "success",
//         title: "Updated Successfully! 🎉",
//         text: result.message || "Subscription plan has been updated.",
//         confirmButtonText: "Go to List",
//         confirmButtonColor: "#4CAF50",
//       }).then(() => {
//         router.push("/admin/subscriptions");
//       });
//     } catch (error: any) {
//       Swal.fire({
//         icon: "error",
//         title: "Update Failed",
//         text: error?.data?.message || "Could not update subscription plan.",
//         confirmButtonText: "Try Again",
//       });
//     }
//   };

  if (!id) {
    return (
      <div className="p-6 text-center text-red-500">No subscription ID provided.</div>
    );
  }

  if (isFetching) {
    return <div className="p-6 text-center">Loading subscription details...</div>;
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Edit Subscription Plan</h1>
          <p className="text-muted-foreground mt-2">
            Update the details for &quot;{formData.subscriptionName || 'Loading...'}&quot;.
          </p>
        </div>

        <form  className="space-y-6 max-w-md">
          {/* Subscription Name */}
          <div className="space-y-2">
            <Label htmlFor="subscriptionName" className="text-foreground font-semibold">
              Subscription Name *
            </Label>
            <Input
              id="subscriptionName"
              name="subscriptionName"
              placeholder="e.g., Premium Yearly"
              value={formData.subscriptionName}
              onChange={handleInputChange}
            //   disabled={isFetching || isUpdating}
              className="bg-card border-input focus-visible:ring-2"
            />
          </div>

          {/* Plan Price */}
          <div className="space-y-2">
            <Label htmlFor="planPrice" className="text-foreground font-semibold">
              Price ($)*
            </Label>
            <Input
              id="planPrice"
              name="planPrice"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.planPrice}
              onChange={handleInputChange}
            //   disabled={isUpdating}
              className="bg-card border-input focus-visible:ring-2"
            />
          </div>

          {/* Billing Cycle Toggle */}
          <div className="space-y-2">
            <Label className="text-foreground font-semibold">Billing Cycle *</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.billingCycle === "monthly" ? "default" : "outline"}
                onClick={() => handleBillingToggle("monthly")}
                // disabled={isUpdating}
                className={
                  formData.billingCycle === "monthly"
                    ? "bg-blue-600 hover:bg-blue-700 text-white flex-1"
                    : "flex-1"
                }
              >
                Monthly
              </Button>
              <Button
                type="button"
                variant={formData.billingCycle === "yearly" ? "default" : "outline"}
                onClick={() => handleBillingToggle("yearly")}
                // disabled={isUpdating}
                className={
                  formData.billingCycle === "yearly"
                    ? "bg-blue-600 hover:bg-blue-700 text-white flex-1"
                    : "flex-1"
                }
              >
                Yearly
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground font-semibold">
              Features *
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder={`• Can access all lessons\n• Can communicate with communities\n• Can have one-to-one session`}
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
            //   disabled={isUpdating}
              className="bg-card border-input resize-none focus-visible:ring-2 font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              One feature per line. Empty lines will be ignored.
            </p>
          </div>

          {/* Availability Month Picker */}
          <div className="space-y-2">
            <Label className="text-foreground font-semibold">Start Month (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.availabilityDate && "text-muted-foreground"
                  )}
                //   disabled={isUpdating}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.availabilityDate ? (
                    format(new Date(formData.availabilityDate + "-01"), "MMMM yyyy")
                  ) : (
                    <span>Pick a month</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3 border-b bg-muted/40">
                  <p className="text-sm font-medium text-center">Select Start Month</p>
                </div>
    <Calendar
  mode="single"
  selected={
    formData.availabilityDate
      ? new Date(formData.availabilityDate + "-01")
      : undefined
  }
  onSelect={(date) => date && handleMonthSelect(date)}
  captionLayout="dropdown"
  fromYear={2020}
  toYear={2035}
  initialFocus
/>

              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Choose when this plan becomes active. Optional.
            </p>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
            //   disabled={isUpdating}
            >
              {/* {isUpdating ? "Updating..." : "Update Subscription"} */}
              Update Subscription
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}