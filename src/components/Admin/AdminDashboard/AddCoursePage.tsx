/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Swal from "sweetalert2";
import Image from "next/image";
import { useAddCourseMutation } from "@/redux/features/teacherDashboard/courseApi";

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
  const [addCourse, { isLoading }] = useAddCourseMutation();

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

    // Revoke old preview URL
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    // Create new preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setUploadedPicture(file);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const name = formData.courseName.trim();
  const description = formData.description.trim();
  const teacherName = formData.teacherName.trim();
  const priceStr = formData.price.trim();
  const lessonStr = formData.noOfLessons.trim();

  // Validate required fields
  if (!name) {
    return Swal.fire({
      icon: "error",
      title: "Missing Field",
      text: "Course name is required.",
      confirmButtonText: "OK",
    });
  }

  if (!description) {
    return Swal.fire({
      icon: "error",
      title: "Missing Field",
      text: "Description is required.",
      confirmButtonText: "OK",
    });
  }

  if (!teacherName) {
    return Swal.fire({
      icon: "error",
      title: "Missing Field",
      text: "Teacher name is required.",
      confirmButtonText: "OK",
    });
  }

  const price = parseFloat(priceStr);
  if (isNaN(price) || price < 0) {
    return Swal.fire({
      icon: "error",
      title: "Invalid Price",
      text: "Please enter a valid price.",
      confirmButtonText: "OK",
    });
  }

  const totalLesson = parseInt(lessonStr, 10);
  if (isNaN(totalLesson) || totalLesson <= 0) {
    return Swal.fire({
      icon: "error",
      title: "Invalid Lessons",
      text: "Please enter a valid number of lessons.",
      confirmButtonText: "OK",
    });
  }

  if (!uploadedPicture) {
    return Swal.fire({
      icon: "warning",
      title: "Upload Required",
      text: "Please upload a course thumbnail image.",
      confirmButtonText: "OK",
    });
  }

  // ✅ Build course data object
  const courseData = {
    name,
    description,
    price,
    teacherName,
    totalLesson,
  };

  // ✅ Create FormData with TWO keys: "text" and "file"
  const submitData = new FormData();
  submitData.append("text", JSON.stringify(courseData)); // ← All data as JSON string
  submitData.append("file", uploadedPicture);           // ← Image file

  // 🔍 Debug: Log what's being sent
  console.log("✅ Sending to backend:");
  console.log("→ text:", courseData);
  console.log("→ file:", uploadedPicture.name);

  try {
    const result = await addCourse(submitData).unwrap();

    console.log("🎉 Success Response:", result);

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: result.message || "Course created successfully!",
      confirmButtonText: "Go to Courses",
    }).then(() => {
      window.location.href = "/dashboard/courses/all-courses";
    });

    // Reset form
    setFormData({
      courseName: "",
      teacherName: "",
      description: "",
      noOfLessons: "",
      price: "",
    });
    setUploadedPicture(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
  } catch (error: any) {
    console.error("❌ API Error:", error);

    const errorMsg =
      error?.data?.message ||
      error?.data?.error ||
      "Failed to create course. Check network tab.";

    Swal.fire({
      icon: "error",
      title: "Request Failed",
      text: errorMsg,
      confirmButtonText: "Try Again",
    });
  }
};
  return (
    <main className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Add Course</h1>
          <p className="text-gray-600 mt-2">Fill in the details to create a new course.</p>
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
              placeholder="e.g., Math Mastery Tutorial 2"
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
              placeholder="e.g., Melon Bhai"
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
              placeholder="What will students learn?"
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
              placeholder="e.g., 33"
              value={formData.noOfLessons}
              onChange={handleInputChange}
              className="bg-card border-input"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-foreground font-semibold">
              Price ($)
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              placeholder="e.g., 99"
              value={formData.price}
              onChange={handleInputChange}
              className="bg-card border-input"
            />
          </div>

          {/* Upload Course Picture */}
          <div className="space-y-2">
            <Label htmlFor="coursePicture" className="text-foreground font-semibold">
              Upload Course Thumbnail
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
                  Click to upload or <span className="text-blue-600">drag and drop</span>
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
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium truncate">{uploadedPicture.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedPicture(null);
                      if (previewUrl) URL.revokeObjectURL(previewUrl);
                      setPreviewUrl("");
                    }}
                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                  >
                    Remove
                  </button>
                </div>
                <Image
                  width={200}
                  height={200}
                  src={previewUrl}
                  alt="Course Thumbnail Preview"
                  className="w-full h-24 object-cover rounded"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base"
              disabled={isLoading}
            >
              {isLoading ? "Creating Course..." : "Create Course"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}