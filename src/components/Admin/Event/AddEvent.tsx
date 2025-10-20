"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import Swal from "sweetalert2";

export default function AddEventPage() {
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [memberLimit, setMemberLimit] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState({
    hour: "08",
    minute: "00",
    period: "AM",
  });

  const handleTimeChange = (field: string, value: string) => {
    setSelectedTime((prev) => ({ ...prev, [field]: value }));
  };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!eventName || !eventLocation || !memberLimit || !selectedDate) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please fill in all required fields!",
      confirmButtonText: "OK",
      confirmButtonColor: "#d33",
      background: "#fff",
      color: "#000",
    });
    return;
  }

  // Simulate success
  Swal.fire({
    icon: "success",
    title: "Event Created Successfully! 🎉",
    text: `"${eventName}" has been scheduled.`,
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

  // Optionally reset form or redirect
};

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl ">
        {/* Header */}
        <h1 className="mb-8 text-xl font-semibold text-blue-600">Add Event</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Row 1: Event Name + Event Location */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="eventName" className="text-sm font-medium">
                Event Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="eventName"
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Enter name"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventLocation" className="text-sm font-medium">
                Event Location<span className="text-red-500">*</span>
              </Label>
              <Input
                id="eventLocation"
                type="text"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                placeholder="Enter Location"
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Row 2: Members Limit + Date Picker + Time Picker */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Total Members Limit */}
          <div className="space-y-2">
  <Label className="text-sm font-medium">
    Total members limit<span className="text-red-500">*</span>
  </Label>

  {/* Custom Input Field */}
  <div className="relative">
    <Input
      type="number"
      value={memberLimit || ""}
      onChange={(e) => {
        const value = e.target.value;
        // Prevent negative numbers
        if (value === "" || parseInt(value) > 0) {
          setMemberLimit(value);
        }
      }}
      placeholder="Enter member limit"
      min="1"
      className="w-full pr-16"
      required
    />
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">Members</span>
  </div>

  {/* Optional: Suggested quick buttons */}
<div className="space-y-2">
  <Label className="text-sm font-medium">
    Total members limit<span className="text-red-500">*</span>
  </Label>

  {/* Custom Input Field */}
  <div className="relative">
    <Input
      type="number"
      value={memberLimit || ""}
      onChange={(e) => {
        const value = e.target.value;
        // Prevent negative numbers
        if (value === "" || parseInt(value) > 0) {
          setMemberLimit(value);
        }
      }}
      placeholder="Enter member limit"
      min="1"
      className="w-full pr-16"
      required
    />
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">Members</span>
  </div>

  {/* Optional: Suggested quick buttons */}
  <div className="flex gap-2 mt-2">
    {["10", "20", "30", "50"].map((suggestion) => (
      <Button
        key={suggestion}
        variant="outline"
        size="sm"
        type="button"
        onClick={() => setMemberLimit(suggestion)}
        className="text-xs px-2 py-1 h-8 hover:bg-blue-50 hover:text-blue-700"
      >
        {suggestion}
      </Button>
    ))}
  </div>
</div>
</div>

            {/* Select Event Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Event Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Select Event Time */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Event Time</Label>
              <div className="flex items-center gap-2 rounded-lg border p-4 bg-white shadow-sm">
                <Select
                  value={selectedTime.hour}
                  onValueChange={(value) => handleTimeChange("hour", value)}
                >
                  <SelectTrigger className="w-[60px]">
                    <SelectValue placeholder="08" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={`${i + 1}`.padStart(2, "0")}>
                        {`${i + 1}`.padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span className="text-gray-500">:</span>

                <Select
                  value={selectedTime.minute}
                  onValueChange={(value) => handleTimeChange("minute", value)}
                >
                  <SelectTrigger className="w-[60px]">
                    <SelectValue placeholder="00" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => (
                      <SelectItem key={i} value={`${i}`.padStart(2, "0")}>
                        {`${i}`.padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedTime.period}
                  onValueChange={(value) => handleTimeChange("period", value)}
                >
                  <SelectTrigger className="w-[60px]">
                    <SelectValue placeholder="AM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-medium rounded-md"
            >
              Upload
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}