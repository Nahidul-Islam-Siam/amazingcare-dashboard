"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

export default function AddQuizzPage() {
  const [formData, setFormData] = useState({
    quizTitle: "", // Changed from lessonTitle
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setUploadedFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.quizTitle.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Quiz title is required!",
        confirmButtonText: "Try Again",
      });
      return;
    }

    if (!uploadedFile) {
      Swal.fire({
        icon: "warning",
        title: "Missing Quiz",
        text: "Please upload a quiz file (JSON, PDF, TXT).",
        confirmButtonText: "OK",
      });
      return;
    }

    // Success
    Swal.fire({
      icon: "success",
      title: "Quiz Uploaded Successfully! 🎯",
      text: "Your quiz has been uploaded successfully.",
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
          <h1 className="text-3xl font-bold text-foreground">Quizzes</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          {/* Quiz Title */}
          <div className="space-y-2">
            <Label htmlFor="quizTitle" className="text-foreground font-semibold">
              Quiz Title
            </Label>
            <Input
              id="quizTitle"
              name="quizTitle"
              placeholder="Enter Quiz Title"
              value={formData.quizTitle}
              onChange={handleInputChange}
              className="bg-card border-input"
            />
          </div>

          {/* Upload Quiz */}
          <div className="space-y-2">
            <Label htmlFor="quizFile" className="text-foreground font-semibold">
              Upload Quiz
            </Label>
            {!uploadedFile ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors flex flex-col items-center gap-2"
                onClick={() => document.getElementById("quizFile")?.click()}
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.82 0c1.01 1.1 1.5 2.4 1.5 3.8a3 3 0 0 1-5.356 2.006A4.5 4.5 0 0 1 8 12.5C8 11.1 8.5 9.8 9.09 9z" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <p className="text-sm text-gray-500 mb-1">
                  Upload your <span className="text-blue-600">quiz</span> or drag here
                </p>
                <input
                  id="quizFile"
                  type="file"
                  accept=".json,.pdf,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-medium truncate">{uploadedFile.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedFile(null);
                      if (previewUrl) URL.revokeObjectURL(previewUrl);
                      setPreviewUrl("");
                    }}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    Remove
                  </button>
                </div>
                {uploadedFile.type === "application/pdf" ? (
                  <iframe
                    src={previewUrl}
                    className="w-full h-24 border rounded"
                    title="Quiz Preview"
                  />
                ) : (
                  <div className="text-xs text-gray-500 mt-1">No preview available</div>
                )}
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
