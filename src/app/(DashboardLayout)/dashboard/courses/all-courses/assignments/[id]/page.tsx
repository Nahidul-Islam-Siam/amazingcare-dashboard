/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";
import { useParams, useRouter } from "next/navigation";
import { useAddAssignmentByIdMutation } from "@/redux/features/teacherDashboard/courseApi"; // ✅ Correct hook

export default function AddAssignmentPage() {
  const params = useParams();
  const router = useRouter();

  const courseId = params.id as string;

  const [formData, setFormData] = useState({
    title: "",
    documentUrl: "",
  });

  const [addAssignment, { isLoading }] = useAddAssignmentByIdMutation(); // ✅ Correct mutation

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return Swal.fire({
        icon: "error",
        title: "Missing Title",
        text: "Assignment title is required.",
        confirmButtonText: "OK",
      });
    }

    if (!formData.documentUrl.trim()) {
      return Swal.fire({
        icon: "error",
        title: "Missing URL",
        text: "Please provide an assignment document link.",
        confirmButtonText: "OK",
      });
    }

    // Validate URL format
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlRegex.test(formData.documentUrl.trim())) {
      return Swal.fire({
        icon: "error",
        title: "Invalid URL",
        text: "Please enter a valid URL (e.g., https://example.com/file.pdf).",
        confirmButtonText: "OK",
      });
    }

    const assignmentData = {
      title: formData.title.trim(),
      documentUrl: formData.documentUrl.trim(),
    };

    try {
      const result = await addAssignment({ courseId, assignmentData }).unwrap();

      console.log("✅ Assignment added:", result);

      Swal.fire({
        icon: "success",
        title: "Assignment Added!",
        text: result.message || "Assignment has been added successfully.",
        confirmButtonText: "Go to Course",
      }).then(() => {
        router.push(`/dashboard/courses/all-courses`);
      });

      // Reset form
      setFormData({ title: "", documentUrl: "" });
    } catch (error: any) {
      console.error("❌ API Error:", error);

      const errorMsg =
        error?.data?.message ||
        error?.statusText ||
        "Failed to add assignment. Please try again.";

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
          <h1 className="text-3xl font-bold text-foreground">Add Assignment</h1>
          <p className="text-gray-600 mt-2">Adding assignment to course ID: <strong>{courseId}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          {/* Assignment Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground font-semibold">
              Assignment Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., JavaScript DOM Manipulation Task"
              value={formData.title}
              onChange={handleInputChange}
              className="bg-card border-input"
            />
          </div>

          {/* Document URL */}
          <div className="space-y-2">
            <Label htmlFor="documentUrl" className="text-foreground font-semibold">
              Document URL
            </Label>
            <Input
              id="documentUrl"
              name="documentUrl"
              type="url"
              placeholder="https://example.com/assignments/dom-task.pdf"
              value={formData.documentUrl}
              onChange={handleInputChange}
              className="bg-card border-input"
            />
            <p className="text-xs text-gray-500">
              Must start with <code>http://</code> or <code>https://</code>
            </p>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base"
              disabled={isLoading}
            >
              {isLoading ? "Uploading Assignment..." : "Add Assignment"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}