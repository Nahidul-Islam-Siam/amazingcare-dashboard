"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

export default function AddLessonPage() {
  const [formData, setFormData] = useState({
    lessonTitle: "",
  });

  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

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

    // Revoke old URL
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    // Generate new preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setUploadedVideo(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.lessonTitle.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Lesson title is required!",
        confirmButtonText: "Try Again",
      });
      return;
    }

    if (!uploadedVideo) {
      Swal.fire({
        icon: "warning",
        title: "Missing Video",
        text: "Please upload a lesson video.",
        confirmButtonText: "OK",
      });
      return;
    }

    // Success
    Swal.fire({
      icon: "success",
      title: "Lesson Added Successfully! 🎉",
      text: "Your lesson has been created successfully.",
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Lessons</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-md ">
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
              Upload Lessons Videos
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
                  Upload your <span className="text-blue-600">video</span> or drag here
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
                    className="text-red-500 hover:text-red-700 text-xs"
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
