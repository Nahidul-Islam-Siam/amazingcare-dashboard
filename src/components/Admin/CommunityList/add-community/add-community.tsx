"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ImageIcon } from "lucide-react"

export default function AddCommunityPage() {
  const [groupName, setGroupName] = useState("")
  const [groupInterest, setGroupInterest] = useState("")
  const [memberLimit, setMemberLimit] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (file: File) => {
    // Check file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png"]
    if (!validTypes.includes(file.type)) {
      alert("Please upload a .jpeg, .jpg, or .png file")
      return
    }

    // Check file size (25 MB = 25 * 1024 * 1024 bytes)
    const maxSize = 25 * 1024 * 1024
    if (file.size > maxSize) {
      alert("File size must be less than 25 MB")
      return
    }

    setSelectedFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!groupName || !groupInterest || !memberLimit || !selectedFile) {
      alert("Please fill in all required fields")
      return
    }

    console.log("[v0] Form submitted:", {
      groupName,
      groupInterest,
      memberLimit,
      file: selectedFile.name,
    })

    // Handle form submission here
    alert("Community created successfully!")
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className=" max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-foreground">Add Community</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Group Name and Interest */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="groupName" className="text-sm font-medium">
                Group Name<span className="text-destructive">*</span>
              </Label>
              <Input
                id="groupName"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupInterest" className="text-sm font-medium">
                Group Interest<span className="text-destructive">*</span>
              </Label>
              <Input
                id="groupInterest"
                type="text"
                value={groupInterest}
                onChange={(e) => setGroupInterest(e.target.value)}
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Total Members Limit */}
          <div className="space-y-2">
            <Label htmlFor="memberLimit" className="text-sm font-medium">
              Total members limit<span className="text-destructive">*</span>
            </Label>
            <Select value={memberLimit} onValueChange={setMemberLimit} required>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select member limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Community Picture Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Community Picture<span className="text-destructive">*</span>
            </Label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/30"
              }`}
            >
              {selectedFile ? (
                <div className="flex flex-col items-center gap-2 p-6 text-center">
                  <ImageIcon className="h-12 w-12 text-primary" />
                  <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    className="mt-2"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 p-6 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Drop file or Browse</p>
                    <p className="mt-1 text-xs text-muted-foreground">Format: .jpeg, .jpg, .png & max size 25 MB</p>
                  </div>
                  <input
                    type="file"
                    id="fileInput"
                    accept=".jpeg,.jpg,.png"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => document.getElementById("fileInput")?.click()}
                  >
                    Browse Files
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-start">
            <Button type="submit" size="lg" className="min-w-[200px]">
              Upload
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
