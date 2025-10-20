"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

export default function AddAudioPage() {
  const [audioName, setAudioName] = useState("");
  const [category, setCategory] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please upload an audio file (MP3, WAV, etc.).",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!audioName || !category || !audioFile) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all required fields and upload an audio file!",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
        background: "#fff",
        color: "#000",
      });
      return;
    }

    // Simulate upload success
    Swal.fire({
      icon: "success",
      title: "Audio Uploaded Successfully! 🎧",
      text: `"${audioName}" in category "${category}" has been uploaded.`,
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

    // Optionally reset form
    setAudioName("");
    setCategory("");
    setAudioFile(null);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="mb-8 text-xl font-semibold text-blue-600">Add Audio</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Row 1: Audio Name + Category */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="audioName" className="text-sm font-medium">
                Audio Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="audioName"
                type="text"
                value={audioName}
                onChange={(e) => setAudioName(e.target.value)}
                placeholder="Enter audio name"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category<span className="text-red-500">*</span>
              </Label>
              <Input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category"
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Upload Audio Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Upload Audio</Label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById("audioUpload")?.click()}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 10l-7-7m0 0l-7 7m7-7v18"
                  />
                </svg>
                <p className="text-sm text-gray-500">
                  Upload your audio or <span className="text-blue-600 underline">drag here</span>
                </p>
              </div>
              <input
                id="audioUpload"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {audioFile && (
              <p className="text-sm text-green-600 mt-2">
                ✅ {audioFile.name} selected
              </p>
            )}
          </div>

          {/* Submit Button */}
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