/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";
import { useParams, useRouter } from "next/navigation"; // 👈 Import for dynamic route
import { useAddVideoLessonByIdMutation } from "@/redux/features/teacherDashboard/courseApi"; // 👈 Import mutation

export default function AddLessonPage() {
  const params = useParams(); // Get courseId from URL like /courses/68fb68dd904d153ca354a7ab/add-lesson
  const router = useRouter();

  const courseId = params.id as string; // ✅ Extract courseId from URL

  const [formData, setFormData] = useState({
    lessonTitle: "",
  });

  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [addVideoLesson, { isLoading }] = useAddVideoLessonByIdMutation(); // ✅ Mutation hook

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
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

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setUploadedVideo(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.lessonTitle.trim()) {
      return Swal.fire({
        icon: "error",
        title: "Missing Title",
        text: "Lesson title is required.",
        confirmButtonText: "OK",
      });
    }

    if (!uploadedVideo) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Video",
        text: "Please upload a lesson video.",
        confirmButtonText: "OK",
      });
    }

    // ✅ Prepare lesson data as JSON string
    const lessonData = {
      title: formData.lessonTitle.trim(),
    };

    // ✅ Create FormData with two parts: text (JSON) + file
    const submitData = new FormData();
    submitData.append("text", JSON.stringify(lessonData));
    submitData.append("video", uploadedVideo);

    // 🔍 Debug log
    console.log("✅ Submitting Lesson to Course ID:", courseId);
    console.log("→ text:", lessonData);
    console.log("→ video:", uploadedVideo.name);

    try {
      const result = await addVideoLesson({ courseId, formData: submitData }).unwrap();

      console.log("🎉 Success Response:", result);

      Swal.fire({
        icon: "success",
        title: "Lesson Added!",
        text: result.message || "Lesson created successfully!",
        confirmButtonText: "Go to Course",
      }).then(() => {
        router.push(`/dashboard/courses/all-courses`); // Redirect back to course details
      });

      // Reset form
      setFormData({ lessonTitle: "" });
      setUploadedVideo(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    } catch (error: any) {
      console.error("❌ API Error:", error);

      const errorMsg =
        error?.data?.message ||
        error?.data?.error ||
        "Failed to add lesson. Check network tab.";

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
          <h1 className="text-3xl font-bold text-foreground">Add Lesson</h1>
       
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          {/* Lesson Title */}
          <div className="space-y-2">
            <Label htmlFor="lessonTitle" className="text-foreground font-semibold">
              Lesson Title
            </Label>
            <Input
              id="lessonTitle"
              name="lessonTitle"
              placeholder="Enter Lesson Title"
              value={formData.lessonTitle}
              onChange={handleInputChange}
              className="bg-card border-input"
            />
          </div>

          {/* Upload Lessons Videos */}
          <div className="space-y-2">
            <Label htmlFor="lessonVideo" className="text-foreground font-semibold">
              Upload Lesson Video
            </Label>
            {!uploadedVideo ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors flex flex-col items-center gap-2"
                onClick={() => document.getElementById("lessonVideo")?.click()}
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
                  <rect x="2" y="7" width="20" height="10" rx="2" ry="2" />
                  <polygon points="12 12 19 21 12 21 5 21 12 12" />
                </svg>
                <p className="text-sm text-gray-500 mb-1">
                  Click to upload or <span className="text-blue-600">drag and drop</span>
                </p>
                <input
                  id="lessonVideo"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
                
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-medium truncate">{uploadedVideo.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedVideo(null);
                      if (previewUrl) URL.revokeObjectURL(previewUrl);
                      setPreviewUrl("");
                    }}
                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                  >
                    Remove
                  </button>
                </div>
                <video
                  src={previewUrl}
                  controls
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
              {isLoading ? "Uploading Lesson..." : "Add Lesson"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}