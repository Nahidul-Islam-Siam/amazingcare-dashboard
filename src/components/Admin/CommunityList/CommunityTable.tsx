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
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";

// Mock data for Community List
const communities = Array.from({ length: 50 }, (_, i) => ({
  communityId: 12345 + i,
  communityName: "Anexo Praia Búzios",
  pictureUrl: `/images/tableimg.png`,
  totalMembers: [12000, 120, 30000, 4000, 50000, 800000, 9000, 20][i % 8],
  interest: "Spiritual things",
}));

const ITEMS_PER_PAGE = 10;

export function CommunityTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered data
  const filteredCommunities = communities.filter(
    (community) =>
      community.communityName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(community.communityId).includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredCommunities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCommunities = filteredCommunities.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="p-4">
      {/* Header: Title + Search + Add Button */}
      <div className="flex flex-col gap-4 mb-4">
        {/* Title - Top Left */}
        <h2 className="text-xl font-semibold text-[#2662E6]">Community List</h2>

        {/* Search & Button Row - Justify Between */}
        <div className="flex justify-between items-center gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search listing..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Button */}
          <Link href="/dashboard/community/add-community">
            <Button className="bg-[#2662E6] hover:bg-[#1e4faa] text-white shrink-0">
              <span className="mr-2">+</span> Add Community
            </Button>
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        {/* Header Wrapper with Rounded Top Corners */}
        <div className="bg-white border-b border-[#CCC] rounded-t-[8px]">
          <Table>
            <TableHeader className="">
              <TableRow className="bg-[#2662E6]">
                <TableHead className="py-3 px-4 text-white">
                  Community Id
                </TableHead>
                <TableHead className="py-3 px-4 text-white">
                  Community Name
                </TableHead>
                <TableHead className="py-3 px-4 text-white">
                  Picture communi.
                </TableHead>
                <TableHead className="py-3 px-4 text-white">
                  Total Memebers
                </TableHead>
                <TableHead className="py-3 px-4 text-white">Interest</TableHead>
                <TableHead className="py-3 px-4 text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCommunities.map((community, index) => (
                <TableRow key={index} className="border-t hover:bg-gray-50">
                  <TableCell className="py-3 px-4">
                    {community.communityId}
                  </TableCell>
                  <TableCell className="py-3 px-4 font-medium">
                    {community.communityName}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <Image
                      src={community.pictureUrl}
                      width={40}
                      height={40}
                      alt="Community"
                      className="w-10 h-10 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    {community.totalMembers.toLocaleString()}k
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    {community.interest}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span className="text-xs">⋯</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-24">
                        <DropdownMenuItem
                          onClick={() =>
                            alert(`Edit ${community.communityName}`)
                          }
                          className="text-blue-600 hover:bg-blue-50 cursor-pointer"
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            alert(`Remove ${community.communityName}`)
                          }
                          className="text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          Remove
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            alert(`View User List ${community.communityName}`)
                          }
                          className="text-gray-600 hover:bg-gray-50 cursor-pointer"
                        >
                          View User List
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
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
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#2662E6] hover:bg-blue-50"
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
                    : "hover:bg-gray-100"
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
            className="h-8 w-8 text-[#2662E6] hover:bg-blue-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
