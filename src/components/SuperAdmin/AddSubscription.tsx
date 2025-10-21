"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import Swal from "sweetalert2";

export default function AddSubscriptionPage() {
  const [formData, setFormData] = useState({
    subscriptionName: "",
    planPrice: "0.00",
    billingCycle: "monthly", // "monthly" or "yearly"
    description: "",
    availabilityDate: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBillingToggle = (cycle: "monthly" | "yearly") => {
    setFormData((prev) => ({ ...prev, billingCycle: cycle }));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setFormData((prev) => ({
      ...prev,
      availabilityDate: date.toISOString().split("T")[0], // YYYY-MM-DD
    }));
    setShowDatePicker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.subscriptionName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Subscription name is required!",
        confirmButtonText: "Try Again",
      });
      return;
    }

    if (!formData.planPrice || isNaN(parseFloat(formData.planPrice))) {
      Swal.fire({
        icon: "error",
        title: "Invalid Price",
        text: "Please enter a valid price.",
        confirmButtonText: "Fix It",
      });
      return;
    }

    // Show success
    Swal.fire({
      icon: "success",
      title: "Subscription Created Successfully! 🎉",
      text: `Your ${formData.billingCycle} plan "${formData.subscriptionName}" has been saved.`,
      confirmButtonText: "Got it",
      confirmButtonColor: "#4CAF50",
      background: "#fff",
      color: "#000",
      timer: 3000,
      timerProgressBar: true,
      customClass: {
        popup: "border-2 border-blue-100 rounded-lg shadow-xl",
      },
    });
  };

  const formatDateDisplay = (date: Date | null) => {
    if (!date) return "Set Availability Time";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Add Subscription</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          {/* Subscription Name */}
          <div className="space-y-2">
            <Label htmlFor="subscriptionName" className="text-foreground font-semibold">
              Subscription Name
            </Label>
            <Input
              id="subscriptionName"
              name="subscriptionName"
              placeholder="Enter subscription name"
              value={formData.subscriptionName}
              onChange={handleInputChange}
              className="bg-card border-input"
            />
          </div>

          {/* Plan Price */}
          <div className="space-y-2">
            <Label htmlFor="planPrice" className="text-foreground font-semibold">
              Plan Price
            </Label>
            <Input
              id="planPrice"
              name="planPrice"
              type="number"
              step="0.01"
              min="0"
              placeholder="$0.00"
              value={formData.planPrice}
              onChange={handleInputChange}
              className="bg-card border-input"
            />
          </div>

          {/* Billing Cycle Toggle */}
          <div className="space-y-2">
            <Label className="text-foreground font-semibold">Billing Cycle</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.billingCycle === "monthly" ? "default" : "outline"}
                onClick={() => handleBillingToggle("monthly")}
                className={`flex-1 ${
                  formData.billingCycle === "monthly" ? "bg-blue-600 text-white" : ""
                }`}
              >
                Monthly
              </Button>
              <Button
                type="button"
                variant={formData.billingCycle === "yearly" ? "default" : "outline"}
                onClick={() => handleBillingToggle("yearly")}
                className={`flex-1 ${
                  formData.billingCycle === "yearly" ? "bg-blue-600 text-white" : ""
                }`}
              >
                Yearly
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="bg-card border-input resize-none"
            />
          </div>

          {/* Set Availability Time */}
          <div className="space-y-2">
            <Label className="text-foreground font-semibold">Set Availability Time</Label>
            <div
              className="relative w-full p-3 border border-input rounded-md cursor-pointer bg-card hover:bg-card/50"
              onClick={() => setShowDatePicker(true)}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {formatDateDisplay(selectedDate)}
                </span>
              </div>
            </div>

            {/* Date Picker Modal */}
            {showDatePicker && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-4 rounded-lg shadow-lg w-[320px]">
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                    <h3 className="text-lg font-semibold">Select Date</h3>
                    <button
                      onClick={() => {
                        if (selectedDate) handleDateSelect(selectedDate);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Okay
                    </button>
                  </div>

                  {/* Month Selector */}
                  <div className="mb-4">
                    <select
                      className="border rounded px-2 py-1 w-full"
                      value={
                        selectedDate?.getFullYear() ||
                        new Date().getFullYear()
                      }
                      onChange={(e) => {
                        const year = parseInt(e.target.value);
                        const month = selectedDate?.getMonth() || 0;
                        const day = selectedDate?.getDate() || 1;
                        setSelectedDate(new Date(year, month, day));
                      }}
                    >
                      {[...Array(10)].map((_, i) => {
                        const year = new Date().getFullYear() - 5 + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Day Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                      <div key={day} className="font-semibold">{day}</div>
                    ))}
                    {[...Array(31)].map((_, i) => {
                      const day = i + 1;
                      return (
                        <div
                          key={day}
                          className={`p-2 rounded ${
                            selectedDate?.getDate() === day
                              ? 'bg-blue-100 text-blue-700'
                              : 'hover:bg-gray-100'
                          } cursor-pointer`}
                          onClick={() => {
                            const d = new Date();
                            d.setDate(day);
                            setSelectedDate(d);
                          }}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              Create Subscription
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}