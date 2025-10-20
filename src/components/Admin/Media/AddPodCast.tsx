"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

export default function AddPodcastPage() {
  const [podcastTopic, setPodcastTopic] = useState("");
  const [hostName, setHostName] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
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
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please upload a video file.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!podcastTopic || !hostName || !videoFile) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all required fields and upload a video!",
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
      title: "Podcast Uploaded Successfully! 🎙️",
      text: `"${podcastTopic}" by ${hostName} has been uploaded.`,
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
    setPodcastTopic("");
    setHostName("");
    setVideoFile(null);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl">
        {/* Header */}
        <h1 className="mb-8 text-xl font-semibold text-blue-600">Add Podcast</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Row 1: Podcast Topic + Host Name */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="podcastTopic" className="text-sm font-medium">
                Podcast Topic<span className="text-red-500">*</span>
              </Label>
              <Input
                id="podcastTopic"
                type="text"
                value={podcastTopic}
                onChange={(e) => setPodcastTopic(e.target.value)}
                placeholder="Enter topic"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hostName" className="text-sm font-medium">
                Host Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="hostName"
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="Enter host name"
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Upload Video Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Upload Video</Label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById("videoUpload")?.click()}
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
                    d="M15 10l4.553-4.553A2 2 0 0120 6h4v2a2 2 0 01-2 2h-2v2a2 2 0 01-2 2h-2v2a2 2 0 01-2 2h-2z"
                  />
                </svg>
                <p className="text-sm text-gray-500">
                  Upload your video or <span className="text-blue-600 underline">drag here</span>
                </p>
              </div>
              <input
                id="videoUpload"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {videoFile && (
              <p className="text-sm text-green-600 mt-2">
                ✅ {videoFile.name} selected
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