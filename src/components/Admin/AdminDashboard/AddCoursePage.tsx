"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
} from "lucide-react";
import Swal from "sweetalert2";


type PreviewUrls = {
  videos: string;
  notes: string;
  quiz: string;
  assignment: string;
};
export default function AddCoursePage() {
  const [formData, setFormData] = useState({
    courseName: "",
    teacherName: "",
    description: "",
    noOfLessons: "",
    availabilityDate: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    videos: null as File | null,
    notes: null as File | null,
    quiz: null as File | null,
    assignment: null as File | null,
  });


  const [previewUrls, setPreviewUrls] = useState<PreviewUrls>({
    videos: "",
    notes: "",
    quiz: "",
    assignment: "",
  });

  // For date picker modal
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

useEffect(() => {
  return () => {
    // Clean up all object URLs when component unmounts
    Object.values(previewUrls).forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });
  };
}, [previewUrls]); // Empty deps = runs once on unmount

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setFormData((prev) => ({
      ...prev,
      availabilityDate: date.toISOString().split("T")[0], // YYYY-MM-DD
    }));
    setShowDatePicker(false);
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    setUploadedFiles((prev) => ({
      ...prev,
      [field]: file,
    }));

    // Revoke old URL
    if (previewUrls[field as keyof PreviewUrls]) {
      URL.revokeObjectURL(previewUrls[field as keyof PreviewUrls]);
    }

    // Generate new preview URL
    let url = "";
    if (file.type.startsWith("image/")) {
      url = URL.createObjectURL(file);
    } else if (file.type.startsWith("video/")) {
      url = URL.createObjectURL(file);
    } else if (file.type === "application/pdf" || file.type === "text/plain") {
      url = URL.createObjectURL(file);
    } else {
      url = ""; // No preview for .docx, .zip, etc.
    }

    setPreviewUrls((prev) => ({
      ...prev,
      [field]: url,
    }));
  };


 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // Simple validation
  if (!formData.courseName.trim()) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Course name is required!",
      confirmButtonText: "Try Again",
    });
    return;
  }

  if (!uploadedFiles.videos) {
    Swal.fire({
      icon: "warning",
      title: "Missing Video",
      text: "Please upload at least one video lesson.",
      confirmButtonText: "OK",
    });
    return;
  }


  // Show success only if valid
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

  // Helper to render date in "Mo, May 14" format
  const formatDateDisplay = (date: Date | null) => {
    if (!date) return "Set Availability Time";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Add Course
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Left Column - Form Fields */}
          <div className="space-y-6">
            {/* Course Name */}
            <div className="space-y-2">
              <Label
                htmlFor="courseName"
                className="text-foreground font-semibold"
              >
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
              <Label
                htmlFor="teacherName"
                className="text-foreground font-semibold"
              >
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
              <Label
                htmlFor="description"
                className="text-foreground font-semibold"
              >
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

            {/* No. of Lessons */}
            <div className="space-y-2">
              <Label
                htmlFor="noOfLessons"
                className="text-foreground font-semibold"
              >
                No. of Lesson
              </Label>
              <Input
                id="noOfLessons"
                name="noOfLessons"
                type="number"
                placeholder="Enter lesson no."
                value={formData.noOfLessons}
                onChange={handleInputChange}
                className="bg-card border-input"
              />
            </div>

            {/* Set Availability Time */}
            <div className="space-y-2">
              <Label className="text-foreground font-semibold">
                Set Availability Time
              </Label>
              <div
                className="relative w-full p-3 border border-input rounded-md cursor-pointer bg-card hover:bg-card/50"
                onClick={() => setShowDatePicker(true)}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {formatDateDisplay(selectedDate)}
                  </span>
                </div>
              </div>

              {/* Date Picker Modal */}
              {showDatePicker && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white p-4 rounded-lg shadow-lg w-[320px]">
                    <div className="flex justify-between items-center mb-4">
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                      <h3 className="text-lg font-semibold">Select Date</h3>
                      <button
                        onClick={() => {
                          if (selectedDate) handleDateSelect(selectedDate);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Okay
                      </button>
                    </div>

                    {/* Simple Month Selector */}
                    <div className="mb-4">
                      <select
                        className="border rounded px-2 py-1 w-full"
                        value={
                          selectedDate?.getFullYear() ||
                          new Date().getFullYear()
                        }
                        onChange={(e) => {
                          const year = parseInt(e.target.value);
                          const month = selectedDate?.getMonth() || 0;
                          const day = selectedDate?.getDate() || 1;
                          setSelectedDate(new Date(year, month, day));
                        }}
                      >
                        {[...Array(10)].map((_, i) => {
                          const year = new Date().getFullYear() - 5 + i;
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Simple Day Grid (for demo) */}
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <div key={day} className="font-semibold">
                          {day}
                        </div>
                      ))}
                      {[...Array(31)].map((_, i) => {
                        const day = i + 1;
                        return (
                          <div
                            key={day}
                            className={`p-2 rounded ${
                              selectedDate?.getDate() === day
                                ? "bg-blue-100 text-blue-700"
                                : "hover:bg-gray-100"
                            } cursor-pointer`}
                            onClick={() => {
                              const d = new Date();
                              d.setDate(day);
                              setSelectedDate(d);
                            }}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Upload Sections */}
       {/* Right Column - Upload Sections */}
<div className="space-y-6">
  {/* Upload Lessons Videos */}
  <div className="border rounded-lg p-4 bg-white">
    <div className="flex items-center gap-2 mb-3">
      <h3 className="text-sm font-semibold">Upload Lessons Videos</h3>
    </div>
    
    {/* Upload Zone or Preview */}
    {!uploadedFiles.videos ? (
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors flex flex-col items-center gap-2"
        onClick={() => document.getElementById("videos")?.click()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="26" viewBox="0 0 40 26" fill="none">
          <path d="M1.25 20.8124V5.18742C1.25 4.08235 1.68899 3.02254 2.47039 2.24114C3.25179 1.45974 4.3116 1.02075 5.41667 1.02075H23.125C24.2301 1.02075 25.2899 1.45974 26.0713 2.24114C26.8527 3.02254 27.2917 4.08235 27.2917 5.18742V20.8124C27.2917 21.9175 26.8527 22.9773 26.0713 23.7587C25.2899 24.5401 24.2301 24.9791 23.125 24.9791H5.41667C4.3116 24.9791 3.25179 24.5401 2.47039 23.7587C1.68899 22.9773 1.25 21.9175 1.25 20.8124ZM37.0167 2.5645L28.6833 9.98742C28.5735 10.0849 28.4855 10.2046 28.4252 10.3385C28.3649 10.4725 28.3336 10.6176 28.3333 10.7645V14.4687C28.3336 14.6156 28.3649 14.7607 28.4252 14.8946C28.4855 15.0286 28.5735 15.1482 28.6833 15.2458L37.0167 22.6687C37.1668 22.802 37.3523 22.8891 37.5508 22.9195C37.7492 22.9498 37.9523 22.9222 38.1354 22.8399C38.3186 22.7575 38.474 22.624 38.583 22.4554C38.6921 22.2868 38.7501 22.0903 38.75 21.8895V3.34367C38.7501 3.14288 38.6921 2.94635 38.583 2.77774C38.474 2.60913 38.3186 2.47563 38.1354 2.3933C37.9523 2.31098 37.7492 2.28334 37.5508 2.31371C37.3523 2.34408 37.1668 2.43118 37.0167 2.5645Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p className="text-sm text-gray-500 mb-1">
          Upload your audio or <span className="text-blue-600">drag here</span>
        </p>
        <input
          id="videos"
          type="file"
          accept="video/*"
          onChange={(e) => handleFileChange(e, "videos")}
          className="hidden"
        />
      </div>
    ) : (
      // Preview Video
      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-medium truncate">{uploadedFiles.videos.name}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setUploadedFiles((prev) => ({ ...prev, videos: null }));
              if (previewUrls.videos) URL.revokeObjectURL(previewUrls.videos);
              setPreviewUrls((prev) => ({ ...prev, videos: "" }));
            }}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            Remove
          </button>
        </div>
        <video src={previewUrls.videos} controls className="w-full h-24 object-cover rounded" />
      </div>
    )}
  </div>

  {/* Upload Notes */}
  <div className="border rounded-lg p-4 bg-white">
    <div className="flex items-center gap-2 mb-3">
      <h3 className="text-sm font-semibold">Upload Notes</h3>
    </div>

    {!uploadedFiles.notes ? (
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors flex flex-col items-center gap-2"
        onClick={() => document.getElementById("notes")?.click()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
          <path d="M14.5841 14.1505L4.16699 17.2846L12.5447 45.7458L27.0845 41.3715" stroke="#141B34" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M45.8106 11.0934L23.0128 4.0821C23.0016 4.07869 22.9899 4.08502 22.9866 4.09617L14.7098 32.4427C14.7066 32.4535 14.7128 32.465 14.7236 32.4683L37.5162 39.5527C37.5272 39.556 37.5391 39.5498 37.5424 39.5385L45.8245 11.119C45.8276 11.1081 45.8214 11.0967 45.8106 11.0934Z" stroke="#141B34" strokeWidth="1.5"/>
          <path d="M26.8145 14.559L36.779 17.2701" stroke="#141B34" strokeWidth="1.5"/>
          <path d="M24.6836 22.4955L29.6798 23.819" stroke="#141B34" strokeWidth="1.5"/>
        </svg>
        <p className="text-sm text-gray-500 mb-1">
          Upload your audio or <span className="text-blue-600">drag here</span>
        </p>
        <input
          id="notes"
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={(e) => handleFileChange(e, "notes")}
          className="hidden"
        />
      </div>
    ) : (
      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-medium truncate">{uploadedFiles.notes.name}</span>
          <button
            type="button"
            onClick={() => {
              setUploadedFiles((prev) => ({ ...prev, notes: null }));
              if (previewUrls.notes) URL.revokeObjectURL(previewUrls.notes);
              setPreviewUrls((prev) => ({ ...prev, notes: "" }));
            }}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            Remove
          </button>
        </div>
        {previewUrls.notes && uploadedFiles.notes.type === "application/pdf" ? (
          <iframe src={previewUrls.notes} className="w-full h-24 border rounded" title="PDF Preview" />
        ) : (
          <div className="text-xs text-gray-500 mt-1">No preview available</div>
        )}
      </div>
    )}
  </div>

  {/* Upload Quiz */}
  <div className="border rounded-lg p-4 bg-white">
    <div className="flex items-center gap-2 mb-3">
      <h3 className="text-sm font-semibold">Upload Quiz</h3>
    </div>

    {!uploadedFiles.quiz ? (
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors flex flex-col items-center gap-2"
        onClick={() => document.getElementById("quiz")?.click()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
          <path d="M25 4.16663C16.3705 4.16663 9.375 11.1622 9.375 19.7916C9.375 24.6166 11.5619 28.9306 14.9986 31.7968C17.0629 33.5185 18.75 35.8537 18.75 38.5416H31.25C31.25 35.8537 32.9371 33.5185 35.0015 31.7968C38.4381 28.9306 40.625 24.6166 40.625 19.7916C40.625 11.1622 33.6294 4.16663 25 4.16663Z" stroke="#141B34" strokeWidth="1.5"/>
          <path d="M31.25 38.5416H18.75V45.8333H31.25V38.5416Z" stroke="#141B34" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M20.834 16.6667C20.834 14.3655 22.6994 12.5 25.0007 12.5C27.3019 12.5 29.1673 14.3655 29.1673 16.6667C29.1673 17.4961 28.925 18.269 28.5071 18.9183C27.2619 20.8535 25.0007 21.875 25.0007 21.875V23.9583" stroke="#141B34" strokeWidth="1.5" strokeLinecap="square"/>
          <path d="M24.9844 29.1666H25.0031" stroke="#141B34" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round"/>
        </svg>
        <p className="text-sm text-gray-500 mb-1">
          Upload your audio or <span className="text-blue-600">drag here</span>
        </p>
        <input
          id="quiz"
          type="file"
          accept=".json,.pdf,.txt"
          onChange={(e) => handleFileChange(e, "quiz")}
          className="hidden"
        />
      </div>
    ) : (
      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-medium truncate">{uploadedFiles.quiz.name}</span>
          <button
            type="button"
            onClick={() => {
              setUploadedFiles((prev) => ({ ...prev, quiz: null }));
              if (previewUrls.quiz) URL.revokeObjectURL(previewUrls.quiz);
              setPreviewUrls((prev) => ({ ...prev, quiz: "" }));
            }}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            Remove
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1">No preview available</div>
      </div>
    )}
  </div>

  {/* Upload Assignment */}
  <div className="border rounded-lg p-4 bg-white">
    <div className="flex items-center gap-2 mb-3">
      <h3 className="text-sm font-semibold">Upload Assignment</h3>
    </div>

    {!uploadedFiles.assignment ? (
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors flex flex-col items-center gap-2"
        onClick={() => document.getElementById("assignment")?.click()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
          <path d="M43.7494 25V6.25H16.666V43.75H24.9993" stroke="#141B34" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M10.417 6.25H4.16699V37.5L7.29199 43.75L10.417 37.5V6.25Z" stroke="#141B34" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M25 14.5834H35.4167" stroke="#141B34" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round"/>
          <path d="M25 22.9166H35.4167" stroke="#141B34" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round"/>
          <path d="M29.166 39.5833L34.3743 43.75L45.8327 31.25" stroke="#141B34" strokeWidth="1.5" strokeLinecap="square"/>
          <path d="M4.16699 14.5834H10.417" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p className="text-sm text-gray-500 mb-1">
          Upload your audio or <span className="text-blue-600">drag here</span>
        </p>
        <input
          id="assignment"
          type="file"
          accept=".pdf,.doc,.zip"
          onChange={(e) => handleFileChange(e, "assignment")}
          className="hidden"
        />
      </div>
    ) : (
      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-medium truncate">{uploadedFiles.assignment.name}</span>
          <button
            type="button"
            onClick={() => {
              setUploadedFiles((prev) => ({ ...prev, assignment: null }));
              if (previewUrls.assignment) URL.revokeObjectURL(previewUrls.assignment);
              setPreviewUrls((prev) => ({ ...prev, assignment: "" }));
            }}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            Remove
          </button>
        </div>
        {previewUrls.assignment && uploadedFiles.assignment.type === "application/pdf" ? (
          <iframe src={previewUrls.assignment} className="w-full h-24 border rounded" title="Assignment Preview" />
        ) : (
          <div className="text-xs text-gray-500 mt-1">No preview available</div>
        )}
      </div>
    )}
  </div>
</div>
        </form>

        {/* Single Upload Button at Bottom */}
        <div className="mt-8 flex justify-center">
          <Button
            type="submit"
            className="w-full max-w-[300px] bg-blue-600 hover:bg-blue-700 text-white py-3"
            onClick={handleSubmit}
          >
            Upload
          </Button>
        </div>
      </div>
    </main>
  );
}
