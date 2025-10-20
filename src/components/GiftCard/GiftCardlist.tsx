/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Input } from "../ui/input";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  useDeleteGiftCardMutation,
  useGetGiftCardsQuery,
} from "@/redux/features/dashboard/giftCarApi"; // Ensure correct path
import coinIcon from "@/assets/dashboard/coin.png";
import TableSkeleton from "@/lib/Loader";
import { Trash2 } from "lucide-react"; // lightweight icon

export default function GiftsCardsList() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const rawParams: Record<string, string> = {};
  if (["ESSENTIAL", "MAJESTIC", "EXCLUSIVE"].includes(filter)) {
    rawParams.category = filter;
  }
  if (filter === "expensive") rawParams.minPrice = "50";
  if (filter === "cheap") rawParams.maxPrice = "50";

  const params = Object.keys(rawParams).length > 0 ? rawParams : undefined;

  const { data, isLoading, isError, refetch } = useGetGiftCardsQuery(params);
  const [deleteGiftCard] = useDeleteGiftCardMutation();

  const allGifts = data?.data || [];

  const filteredGifts = allGifts.filter((gift) => {
    const matchesSearch = searchTerm
      ? gift.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(gift.price).includes(searchTerm)
      : true;
    return matchesSearch;
  });

  if (isLoading) return <TableSkeleton />;
  if (isError)
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Failed to load gift cards.</p>
      </div>
    );

  // 🧨 DELETE FUNCTION WITH SWEETALERT CONFIRMATION
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This gift card will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9E00A7",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "#fff",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteGiftCard(id).unwrap();
          if (res.success) {
            Swal.fire({
              title: "Deleted!",
              text: res.message || "Gift card deleted successfully.",
              icon: "success",
              confirmButtonColor: "#9E00A7",
              timer: 1800,
            });
            refetch();
          } else {
            Swal.fire({
              title: "Failed",
              text: res.message || "Unable to delete gift card.",
              icon: "error",
              confirmButtonColor: "#9E00A7",
            });
          }
        } catch (error: any) {
          Swal.fire({
            title: "Error",
            text: error?.data?.message || "Something went wrong.",
            icon: "error",
            confirmButtonColor: "#9E00A7",
          });
        }
      }
    });
  };

  return (
    <div className="bg-white p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-semibold text-[#585C66]">
            Gift Cards
          </h3>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            <div className="relative mt-2 w-full sm:w-96">
              <Input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#9E00A7] text-sm text-gray-700"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.608 10.608z"
                />
              </svg>
            </div>

            <div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white text-[#585C66] text-sm border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9E00A7] cursor-pointer min-w-32"
              >
                <option value="all">All</option>
                <option value="EXCLUSIVE">Exclusive</option>
                <option value="MAJESTIC">Majestic</option>
                <option value="ESSENTIAL">Essential</option>
                <option value="expensive">Expensive</option>
                <option value="cheap">Cheap</option>
              </select>
            </div>
          </div>
        </div>

        {/* Add Button */}
        <Link
          href="/dashboard/gift-cards/add-gift"
          className="hover:bg-[#8B0095] text-white px-12 py-2 text-sm font-medium transition-colors whitespace-nowrap rounded-[12px] bg-[var(--Primary-color-for-social,#9E00A7)]"
        >
          Add gifts
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {filteredGifts.map((gift) => (
          <div
            key={gift.id}
            className="relative bg-white rounded-xl p-3 text-center shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer group border border-gray-200 hover:border-[#9E00A7] hover:ring-2 hover:ring-[#9E00A7]/30"
          >
            {/* 🗑️ Delete Icon (appears on hover) */}
            {/* <button
              onClick={() => handleDelete(gift.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-100 hover:bg-red-200 text-red-600 p-1 rounded-full"
              title="Delete Gift"
            >
              <Trash2 size={16} />
            </button> */}

            {/* Gift Image */}
            <div className="mb-2">
              <Image
                src={gift.image?.trim?.() || "/placeholder.png"}
                alt={gift.name || "Gift card"}
                width={48}
                height={48}
                className="w-12 h-12 mx-auto object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                unoptimized
              />
            </div>

            {/* Name */}
            <p className="text-xs font-medium text-gray-800 line-clamp-1">
              {gift.name || "Unnamed Gift"}
            </p>

            {/* Coin + Price */}
            <div className="flex items-center justify-center gap-1 mt-1">
              <Image
                src={coinIcon}
                alt="Coin"
                width={16}
                height={16}
                className="w-4 h-4 object-contain"
                unoptimized
              />
              <span className="text-xs font-bold text-gray-700">
                {gift.price?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
