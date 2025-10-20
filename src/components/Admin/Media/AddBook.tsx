"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

export default function AddBookPage() {
  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
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
        text: "Please upload an audio file (MP3, WAV, etc.) for the audiobook.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookName || !authorName || !audioFile) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all required fields and upload the audiobook file!",
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
      title: "Audiobook Uploaded Successfully! 📚🎧",
      text: `"${bookName}" by ${authorName} has been uploaded.`,
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
    setBookName("");
    setAuthorName("");
    setAudioFile(null);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="mb-8 text-xl font-semibold text-blue-600">Add Book</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Row 1: Book Name + Author Name */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bookName" className="text-sm font-medium">
                Book Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="bookName"
                type="text"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                placeholder="Enter book name"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorName" className="text-sm font-medium">
                Author Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="authorName"
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Enter author name"
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Upload Book Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Upload Book</Label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById("bookUpload")?.click()}
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
                    d="M12 6.253v13m0-13C10.832 5.46 9.25 4.5 7.5 4.5S4.168 5.46 3 6.253v13C4.168 18.46 5.75 17.5 7.5 17.5s3.332.96 4.5 1.753m0-13C13.168 5.46 14.75 4.5 16.5 4.5c1.75 0 3.332.96 4.5 1.753v13C19.832 18.46 18.25 17.5 16.5 17.5c-1.75 0-3.332.96-4.5 1.753"
                  />
                </svg>
                <p className="text-sm text-gray-500">
                  Upload your book (audio) or <span className="text-blue-600 underline">drag here</span>
                </p>
              </div>
              <input
                id="bookUpload"
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