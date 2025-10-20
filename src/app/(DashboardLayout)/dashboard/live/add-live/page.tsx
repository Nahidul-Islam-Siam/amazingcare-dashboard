"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function CreateLivePage() {
  const [title, setTitle] = useState("");
  const [hostName, setHostName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      title,
      hostName,
      description,
      date,
    });
    // Handle upload logic here
  };

  return (
    <div className="min-h-screen max-w-5xl  bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Create Live
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border">
          
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Host Name */}
          <div>
            <Label htmlFor="hostName">Host Name</Label>
            <Input
              id="hostName"
              placeholder="Enter host name"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date">Release Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 ">
            <Button
              type="submit"
              className="w-full bg-[#2667FF] text-white font-semibold py-3 text-base"
            >
              Upload
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}