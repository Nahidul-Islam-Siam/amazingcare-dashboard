/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAddUpCommingLivesMutation } from "@/redux/features/teacherDashboard/upcommingApi";
import { toast } from "sonner";
import Image from "next/image";

export default function CreateLivePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [totalPrice, setTotalPrice] = useState<number | "">("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [addLiveSession, { isLoading }] = useAddUpCommingLivesMutation();

  // Handle file change and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Create preview URL
    }
  };

  // Revoke preview URL on unmount or reset
  const resetImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImage(null);
    setImagePreview(null);
    const input = document.getElementById("image-upload") as HTMLInputElement;
    if (input) input.value = "";
  };

  // Validate datetime is in the future (Bangladesh Time considered)
  const isValidDateTime = () => {
    if (!date || !time) return false;

    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date(); // Client time – assume user is in BD or sync with server

    // Warn if scheduling in the past
    return selectedDateTime > now;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!date || !time) {
      toast.error("Please select both date and time.");
      return;
    }
    if (!isValidDateTime()) {
      toast.error("Please select a future date and time.");
      return;
    }
    if (!meetingLink.trim()) {
      toast.error("Meeting link is required");
      return;
    }
    if (!totalPrice || totalPrice <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    if (!image) {
      toast.error("Please upload a session image");
      return;
    }

    // Prepare session data
    const sessionData = {
      title: title.trim(),
      teacherId: "689a3b4ba190e253e35f49e2", // Replace with dynamic ID later
      description: description.trim(),
      date, // Expected format: YYYY-MM-DD
      time, // HH:mm
      // meetingLink: meetingLink.trim(),
      totalPrice: Number(totalPrice),
    };

const payload = {
  data: JSON.stringify(sessionData),
  image,
};
    try {
      const result = await addLiveSession(payload).unwrap();

      toast.success(result.message || "Live session created successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setMeetingLink("");
      setTotalPrice("");
      resetImage();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.data?.error ||
        "Failed to create live session. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Create Live Session
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border">
          
          {/* Title */}
          <div>
            <Label htmlFor="title">Session Title *</Label>
            <Input
              id="title"
              placeholder="E.g., Grade 10 Chemistry Masterclass"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Explain what students will learn in this session..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]} // Prevent past dates
                required
              />
            </div>

            <div>
              <Label htmlFor="time">Time (Bangladesh Time) *</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Meeting Link */}
          <div>
            <Label htmlFor="meetingLink">Meeting Link *</Label>
            <Input
              id="meetingLink"
              type="url"
              placeholder="https://meet.google.com/abc-def-ghi"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Use Google Meet, Zoom, or any valid video conferencing link.
            </p>
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">Price (USD) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="20.00"
              value={totalPrice}
              onChange={(e) =>
                setTotalPrice(e.target.value ? parseFloat(e.target.value) : "")
              }
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label>Session Cover Image *</Label>
            <div className="mt-1 space-y-3">
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full"
              />

              {imagePreview && (
                <div className="relative inline-block mt-2">
                  <Image
                    src={imagePreview}
                    width={320}
                    height={320}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg shadow-md border"
                  />
                  <button
                    type="button"
                    onClick={resetImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition"
                  >
                    ×
                  </button>
                </div>
              )}

              <p className="text-sm text-gray-500">
                Recommended: JPG or PNG, at least 640×480px.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-[#2667FF] hover:bg-[#1e56d9] text-white font-semibold py-3 text-base disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? "Creating Session..." : "Create Live Session"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}