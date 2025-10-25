"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Swal from "sweetalert2";
import Image from "next/image";

export default function AddCoursePage() {
  const [formData, setFormData] = useState({
    courseName: "",
    teacherName: "",
    description: "",
    noOfLessons: "",
    price: "",
  });

  const [uploadedPicture, setUploadedPicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    // Revoke old URL
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    // Generate new preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setUploadedPicture(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.courseName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Course name is required!",
        confirmButtonText: "Try Again",
      });
      return;
    }

    if (!uploadedPicture) {
      Swal.fire({
        icon: "warning",
        title: "Missing Picture",
        text: "Please upload a course picture.",
        confirmButtonText: "OK",
      });
      return;
    }

    // Success
    Swal.fire({
      icon: "success",
      title: "Course Created Successfully! 🎉",
      text: "Your course has been created successfully.",
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

  return (
    <main className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Add Course</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          {/* Course Name */}
          <div className="space-y-2">
            <Label htmlFor="courseName" className="text-foreground font-semibold">
              Course Name
            </Label>
            <Input
              id="courseName"
              name="courseName"
              placeholder="Enter course name"
              value={formData.courseName}
              onChange={handleInputChange}
              className="bg-card border-input"
            />
          </div>

          {/* Teacher Name */}
          <div className="space-y-2">
            <Label htmlFor="teacherName" className="text-foreground font-semibold">
              Teacher Name
            </Label>
            <Input
              id="teacherName"
              name="teacherName"
              placeholder="Enter teacher name"
              value={formData.teacherName}
              onChange={handleInputChange}
              className="bg-card border-input"
            />
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

          {/* Total Lessons */}
          <div className="space-y-2">
            <Label htmlFor="noOfLessons" className="text-foreground font-semibold">
              Total Lessons
            </Label>
            <Input
              id="noOfLessons"
              name="noOfLessons"
              type="number"
              placeholder="Enter number of lessons"
              value={formData.noOfLessons}
              onChange={handleInputChange}
              className="bg-card border-input"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-foreground font-semibold">
              Price
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleInputChange}
              className="bg-card border-input"
            />
          </div>

          {/* Upload Course Picture */}
          <div className="space-y-2">
            <Label htmlFor="coursePicture" className="text-foreground font-semibold">
              Upload Course Picture
            </Label>
            {!uploadedPicture ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors flex flex-col items-center gap-2"
                onClick={() => document.getElementById("coursePicture")?.click()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-500"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p className="text-sm text-gray-500 mb-1">
                  Upload your picture or <span className="text-blue-600">drag here</span>
                </p>
                <input
                  id="coursePicture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-medium truncate">{uploadedPicture.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedPicture(null);
                      if (previewUrl) URL.revokeObjectURL(previewUrl);
                      setPreviewUrl("");
                    }}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    Remove
                  </button>
                </div>
                <Image
                  width={200}
                  height={200}
                  src={previewUrl}
                  alt="Course Preview"
                  className="w-full h-24 object-cover rounded"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              Upload
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
