"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Updated data to match Donation List structure
const donations = Array.from({ length: 50 }, (_) => ({
  date: "02/10/2025",
  userId: 12345,
  userName: "Wade Warren",
  email: "georgia.young@example.com",
  amount: "$1850",
}));

const ITEMS_PER_PAGE = 10;

export function DonationTable() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(donations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDonations = donations.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div>
      {/* Header Title + Dropdown */}
      <div className="flex items-center justify-between py-4 border-b bg-white">
        <h2 className="text-lg font-semibold text-gray-800">Donation List</h2>
        <select className="border rounded px-2 py-1 text-sm">
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        {/* Header Wrapper with Rounded Top Corners */}
        <div className="bg-white border-b border-[#CCC] rounded-t-[8px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#2662E6] ">
                <TableHead className="text-white py-3 px-4">Date</TableHead>
                <TableHead className="text-white py-3 px-4">User ID</TableHead>
                <TableHead className="text-white py-3 px-4">User Name</TableHead>
                <TableHead className="text-white py-3 px-4">Email</TableHead>
                <TableHead className="text-white py-3 px-4 text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentDonations.map((donation, index) => (
                <TableRow key={index} className="border-t">
                  <TableCell className="py-3 px-4">{donation.date}</TableCell>
                  <TableCell className="py-3 px-4">{donation.userId}</TableCell>
                  <TableCell className="py-3 px-4 font-medium">{donation.userName}</TableCell>
                  <TableCell className="py-3 px-4">{donation.email}</TableCell>
                  <TableCell className="py-3 px-4 text-right">{donation.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-1 border-t p-4">
          <Button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 bg-white text-[#2662E6] border-[#2662E6]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="icon"
                onClick={() => goToPage(page)}
                className={`h-8 w-8 ${
                  currentPage === page
                    ? "bg-[#2662E6] hover:bg-[#2662E6] text-white"
                    : ""
                }`}
              >
                {page}
              </Button>
            );
          })}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}