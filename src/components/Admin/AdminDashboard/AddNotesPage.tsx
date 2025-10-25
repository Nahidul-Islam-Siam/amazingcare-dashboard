"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

export default function AddNotesPage() {
  const [formData, setFormData] = useState({
    lessonTitle: "",
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
    if (!formData.lessonTitle.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Lesson title is required!",
        confirmButtonText: "Try Again",
      });
      return;
    }

    if (!uploadedFile) {
      Swal.fire({
        icon: "warning",
        title: "Missing Notes",
        text: "Please upload a notes file (PDF, DOC, TXT).",
        confirmButtonText: "OK",
      });
      return;
    }

    // Success
    Swal.fire({
      icon: "success",
      title: "Notes Uploaded Successfully! 📚",
      text: "Your lesson notes have been uploaded successfully.",
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
          <h1 className="text-3xl font-bold text-foreground">Add Notes</h1>
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

          {/* Upload Notes */}
          <div className="space-y-2">
            <Label htmlFor="notesFile" className="text-foreground font-semibold">
              Upload Notes
            </Label>
            {!uploadedFile ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors flex flex-col items-center gap-2"
                onClick={() => document.getElementById("notesFile")?.click()}
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
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <p className="text-sm text-gray-500 mb-1">
                  Upload your <span className="text-blue-600">notes</span> or drag here
                </p>
                <input
                  id="notesFile"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
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
                    title="Notes Preview"
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
