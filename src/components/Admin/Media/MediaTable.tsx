/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";

// Mock data
const podcasts = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  date: "02/10/2025",
  topic: ["Jesus Always With Us", "The Power of Prayer", "Walking in Faith", "God's Love Never Fails", "Holy Spirit Guide Me", "The Resurrection Hope"][i],
  host: "Father Lokhonga",
  thumbnail: `/images/podcast.png`,
}));

const books = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  date: "02/10/2025",
  name: ["Worship", "Prayer Mountain", "Faith Journey", "Grace Uncovered", "Shepherd My Soul", "Kingdom Principles"][i],
  thumbnail: `/images/book.png`,
}));

const audios = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  date: "02/10/2025",
  name: ["The Lord Is My...", "Abide in Me", "I Will Sing", "Holy Holy Holy", "Blessed Be Your Name", "Amazing Grace"][i],
  category: ["Faith", "Hope", "Praise", "Worship", "Sermon", "Teaching"][i],
  duration: ["23:1", "18:45", "27:30", "15:20", "32:10", "20:05"][i],
  thumbnail: `/images/audio.png`,
}));

const others = Array.from({ length: 6 }, (_, i) => {
  const items = [
    { name: "Workship", thumb: "/images/book.png" },
    { name: "The Lord...", thumb: "/images/audio.png" },
    { name: "Jesus always...", thumb: "/images/podcast.png" },
    { name: "Grace", thumb: "/images/book.png" },
    { name: "Holy Spirit", thumb: "/images/audio.png" },
    { name: "Resurrection", thumb: "/images/podcast.png" },
  ];
  return { ...items[i], date: "02/10/2025", id: i + 1 };
});

export function MediaTableLists() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<{
    type: "podcasts" | "books" | "audios" | "others" | null;
    column: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Filter function
  const filterItems = (list: any[], keys: string[]) => {
    if (!searchTerm) return list;
    const term = searchTerm.toLowerCase();
    return list.filter((item) =>
      keys.some((key) => String(item[key]).toLowerCase().includes(term))
    );
  };

  // Sort function
  const sortItems = (list: any[], key: string, direction: "asc" | "desc") => {
    return [...list].sort((a, b) => {
      const aVal = a[key]?.toString().toLowerCase();
      const bVal = b[key]?.toString().toLowerCase();

      if (!aVal && !bVal) return 0;
      if (!aVal) return 1;
      if (!bVal) return -1;

      return direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  };

  const getSorted = (list: any[], defaultKey: string) => {
    if (!sort || !sort.type) return list;
    return sort.column && sort.direction
      ? sortItems(list, sort.column, sort.direction)
      : list;
  };

  const filteredPodcasts = filterItems(podcasts, ["topic", "host", "date"]);
  const filteredBooks = filterItems(books, ["name", "date"]);
  const filteredAudios = filterItems(audios, ["name", "category", "duration", "date"]);
  const filteredOthers = filterItems(others, ["name", "date"]);

  const sortedPodcasts = getSorted(filteredPodcasts, "date");
  const sortedBooks = getSorted(filteredBooks, "date");
  const sortedAudios = getSorted(filteredAudios, "date");
  const sortedOthers = getSorted(filteredOthers, "date");

  // Handle sorting
  const handleSort = (type: "podcasts" | "books" | "audios" | "others", column: string) => {
    setSort((prev) => {
      if (prev?.type === type && prev.column === column) {
        return {
          type,
          column,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { type, column, direction: "asc" };
    });
  };

  // Reusable Sortable Header
  const SortableHeader = ({ children, onClick, isSorted, direction }: {
    children: React.ReactNode;
    onClick: () => void;
    isSorted: boolean;
    direction: "asc" | "desc";
  }) => (
    <TableHead
      className="cursor-pointer hover:bg-blue-50 text-white font-medium py-2 px-4"
      onClick={onClick}
    >
      <div className="flex items-center gap-1">
        {children}
        {isSorted && (
          <span className="text-xs">
            {direction === "asc" ? "↑" : "↓"}
          </span>
        )}
      </div>
    </TableHead>
  );

  // Horizontal Scroll Wrapper (for mobile swipe)
  const ScrollContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="md:block">
      <div className="flex space-x-2 pb-2 overflow-x-auto scrollbar-hide sm:scrollbar-thin sm:scrollbar-thumb-gray-300">
        {children}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <h1 className="text-xl font-semibold text-gray-800 mb-6">Media</h1>

      {/* Search Bar */}
      <div className="mb-6 max-w-md">
        <Input
          type="text"
          placeholder="Search media..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid Layout: 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Podcasts */}
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <ScrollContainer>
           <div className="min-w-2xl">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-600">
                    <TableHead className="text-white font-medium py-2 px-4">Podcasts</TableHead>
                    <SortableHeader
                      onClick={() => handleSort("podcasts", "date")}
                      isSorted={sort?.type === "podcasts" && sort.column === "date"}
                      direction={sort?.direction || "asc"}
                    >
                      Date
                    </SortableHeader>
                    <SortableHeader
                      onClick={() => handleSort("podcasts", "topic")}
                      isSorted={sort?.type === "podcasts" && sort.column === "topic"}
                      direction={sort?.direction || "asc"}
                    >
                      Topic
                    </SortableHeader>
                    <SortableHeader
                      onClick={() => handleSort("podcasts", "host")}
                      isSorted={sort?.type === "podcasts" && sort.column === "host"}
                      direction={sort?.direction || "asc"}
                    >
                      Host
                    </SortableHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPodcasts.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="py-2 px-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={item.thumbnail}
                            alt={item.topic}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-md object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 px-4 text-xs">{item.date}</TableCell>
                      <TableCell className="py-2 px-4 font-medium">{item.topic}</TableCell>
                      <TableCell className="py-2 px-4">{item.host}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollContainer>
          <div className="p-3 border-t">
            <Link href="/dashboard/media/podcasts" className="text-blue-600 text-sm font-medium">
              See all →
            </Link>
          </div>
        </div>

        {/* Books */}
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <ScrollContainer>
          <div className="min-w-2xl">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-600">
                    <TableHead className="text-white font-medium py-2 px-4">Books</TableHead>
                    <SortableHeader
                      onClick={() => handleSort("books", "date")}
                      isSorted={sort?.type === "books" && sort.column === "date"}
                      direction={sort?.direction || "asc"}
                    >
                      Date
                    </SortableHeader>
                    <SortableHeader
                      onClick={() => handleSort("books", "name")}
                      isSorted={sort?.type === "books" && sort.column === "name"}
                      direction={sort?.direction || "asc"}
                    >
                      Name
                    </SortableHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedBooks.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="py-2 px-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={item.thumbnail}
                            alt={item.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-md object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 px-4 text-xs">{item.date}</TableCell>
                      <TableCell className="py-2 px-4 font-medium">{item.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollContainer>
          <div className="p-3 border-t">
            <Link href="/dashboard/media/books" className="text-blue-600 text-sm font-medium">
              See all →
            </Link>
          </div>
        </div>

        {/* Audios */}
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <ScrollContainer>
            <div className="min-w-2xl">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-600 ">
                    <TableHead className="text-white font-medium py-2 px-4">Audios</TableHead>
                    <SortableHeader
                      onClick={() => handleSort("audios", "date")}
                      isSorted={sort?.type === "audios" && sort.column === "date"}
                      direction={sort?.direction || "asc"}
                    >
                      Date
                    </SortableHeader>
                    <SortableHeader
                      onClick={() => handleSort("audios", "name")}
                      isSorted={sort?.type === "audios" && sort.column === "name"}
                      direction={sort?.direction || "asc"}
                    >
                      Name
                    </SortableHeader>
                    <SortableHeader
                      onClick={() => handleSort("audios", "category")}
                      isSorted={sort?.type === "audios" && sort.column === "category"}
                      direction={sort?.direction || "asc"}
                    >
                      Category
                    </SortableHeader>
                    <SortableHeader
                      onClick={() => handleSort("audios", "duration")}
                      isSorted={sort?.type === "audios" && sort.column === "duration"}
                      direction={sort?.direction || "asc"}
                    >
                      Duration
                    </SortableHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAudios.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="py-2 px-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={item.thumbnail}
                            alt={item.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-md object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 px-4 text-xs">{item.date}</TableCell>
                      <TableCell className="py-2 px-4 font-medium">{item.name}</TableCell>
                      <TableCell className="py-2 px-4">{item.category}</TableCell>
                      <TableCell className="py-2 px-4">{item.duration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollContainer>
          <div className="p-3 border-t">
            <Link href="/dashboard/media/audios" className="text-blue-600 text-sm font-medium">
              See all →
            </Link>
          </div>
        </div>

        {/* Others */}
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <ScrollContainer>
 <div className="min-w-2xl">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-600">
                    <TableHead className="text-white font-medium py-2 px-4">Others</TableHead>
                    <SortableHeader
                      onClick={() => handleSort("others", "date")}
                      isSorted={sort?.type === "others" && sort.column === "date"}
                      direction={sort?.direction || "asc"}
                    >
                      Date
                    </SortableHeader>
                    <SortableHeader
                      onClick={() => handleSort("others", "name")}
                      isSorted={sort?.type === "others" && sort.column === "name"}
                      direction={sort?.direction || "asc"}
                    >
                      Name
                    </SortableHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedOthers.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="py-2 px-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={item.thumb || item.thumbnail}
                            alt={item.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-md object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2 px-4 text-xs">{item.date}</TableCell>
                      <TableCell className="py-2 px-4 font-medium">{item.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollContainer>
          <div className="p-3 border-t">
            <Link href="/dashboard/media/others" className="text-blue-600 text-sm font-medium">
              See all →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}