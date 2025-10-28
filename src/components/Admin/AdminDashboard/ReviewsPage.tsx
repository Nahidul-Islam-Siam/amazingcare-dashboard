/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Swal from 'sweetalert2';
import { useState } from "react";
import { useApproveReviewMutation, useGetPendingReviewsQuery, useRejectReviewMutation } from "@/redux/features/superAdmin/reviewApi";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import TableSkeleton from "@/lib/Loader";

export default function ReviewsPage() {
  // ✅ Fetch pending reviews from Redux query
  const { data, isLoading, isError } = useGetPendingReviewsQuery();

const [approveReview] = useApproveReviewMutation();
const [rejectReview] = useRejectReviewMutation();

  const [page, setPage] = useState(1);
  const perPage = 5;

  // ✅ Handle paginated data
  const reviews = data?.data || [];
  const totalPages = Math.ceil(reviews.length / perPage);
  const currentReviews = reviews.slice((page - 1) * perPage, page * perPage);
const handleAccept = async (id: string) => {
  const result = await Swal.fire({
    title: "Accept this review?",
    text: "Once accepted, this review will be visible publicly.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, accept it!",
    cancelButtonText: "Cancel",
    customClass: {
      popup: "border-2 border-blue-200 rounded-lg shadow-xl",
      confirmButton: "bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md",
      cancelButton: "bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md",
    },
    buttonsStyling: false,
  });

  if (!result.isConfirmed) return;

  try {
    const res = await approveReview( id ).unwrap();

    Swal.fire({
      title: "Accepted!",
      text: res?.message || "The review has been approved.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });

    // Remove the approved review from current table
    const updatedReviews = reviews.filter((r) => r.id !== id);
    setPage(1); // reset page if needed
    // if you have a state to hold reviews, update it here:
    // setReviews(updatedReviews);

  } catch (error: any) {
    Swal.fire({
      title: "Error!",
      text: error?.data?.message || "Failed to approve review.",
      icon: "error",
    });
  }
};

const handleReject = async (id: string) => {
  const result = await Swal.fire({
    title: "Reject this review?",
    text: "Rejected reviews will not be shown publicly.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, reject it!",
    cancelButtonText: "Cancel",
    customClass: {
      popup: "border-2 border-red-200 rounded-lg shadow-xl",
      confirmButton: "bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md",
      cancelButton: "bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md",
    },
    buttonsStyling: false,
  });

  if (!result.isConfirmed) return;

  try {
    const res = await rejectReview( id ).unwrap();

    Swal.fire({
      title: "Rejected!",
      text: res?.message || "The review has been rejected.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });

    // Remove the rejected review from current table
    const updatedReviews = reviews.filter((r) => r.id !== id);
    setPage(1); // reset page if needed
    // if you have a state to hold reviews, update it here:
    // setReviews(updatedReviews);

  } catch (error: any) {
    Swal.fire({
      title: "Error!",
      text: error?.data?.message || "Failed to reject review.",
      icon: "error",
    });
  }
};


  // ✅ Show full review modal
  const openReviewModal = (review: any) => {
    Swal.fire({
      title: `Review by ${review.user?.firstName || "Unknown"}`,
      html: `
        <div class="text-left p-4">
          <div class="flex items-center gap-3 mb-4">
            <img src="${review.user?.profileImage || '/default-avatar.png'}" 
                 alt="${review.user?.firstName || 'User'}" 
                 class="w-10 h-10 rounded-full object-cover" />
            <div>
              <p class="font-semibold text-gray-900">${review.user?.firstName || "Unknown"} ${review.user?.lastName || ""}</p>
              <p class="text-sm text-yellow-500">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</p>
            </div>
          </div>
          <p class="text-gray-700 mb-2"><strong>Date:</strong> ${new Date(review.createdAt).toLocaleDateString()}</p>
          <p class="text-gray-800 leading-relaxed">${review.comment}</p>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: '500px',
      customClass: {
        popup: 'rounded-lg shadow-xl border overflow-hidden max-h-[90vh] overflow-y-auto'
      },
      background: '#fff',
    });
  };

  if (isLoading) {
    return <TableSkeleton/>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load pending reviews.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white">
        <h1 className="text-2xl font-bold text-gray-900">Pending Reviews</h1>
        <Button variant="outline" size="icon" className="border-gray-300">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-[var(--brand-tints,#DDE7FE)] border border-[var(--semi-brand,#398EFD)]">
            <CardContent className="py-8 text-center">
              <p className="text-lg font-medium text-gray-700 mb-1">Pending Reviews</p>
              <p className="text-xl font-bold text-gray-900">{reviews.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">User</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Comment</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Rating</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentReviews.map((review: any) => (
                  <tr key={review.id} className="border-t hover:bg-gray-50">
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 ring-1 ring-gray-200">
                          <AvatarImage src={review.user?.profileImage || "/default-avatar.png"} alt={review.user?.firstName} />
                          <AvatarFallback>{review.user?.firstName?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {review.user?.firstName || "Unknown"} {review.user?.lastName || ""}
                        </span>
                      </div>
                    </td>

                    {/* Comment */}
                    <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-xs">{review.comment}</td>

                    {/* Rating */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>
                            ★
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-sm">{new Date(review.createdAt).toLocaleDateString()}</td>

                    {/* Action */}
               <td className="px-4 py-3 text-right">
  <div className="flex items-center justify-end gap-2">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-gray-300 text-gray-700 hover:bg-gray-100"
        >
     <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

  <DropdownMenuContent align="end" className="w-40">
  {/* ✅ View Details */}
  <DropdownMenuItem
    onClick={() => openReviewModal(review)}
    className="cursor-pointer text-blue-600 hover:text-blue-800"
  >
    View Details
  </DropdownMenuItem>

  {/* ✅ Approve Review */}
  <DropdownMenuItem
    onClick={() => handleAccept(review.id)}
    className="cursor-pointer text-green-600 hover:text-green-800"
  >
    Approve
  </DropdownMenuItem>

  {/* ❌ Reject Review */}
  <DropdownMenuItem
    onClick={() => handleReject(review.id)}
    className="cursor-pointer text-red-600 hover:text-red-800"
  >
    Reject
  </DropdownMenuItem>
</DropdownMenuContent>

    </DropdownMenu>
  </div>
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-start gap-1 mt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-2"
            >
              ←
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                size="sm"
                onClick={() => setPage(i + 1)}
                className={`px-3 py-2 ${page === i + 1 ? "bg-blue-600 text-white" : "border-gray-300"}`}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-2"
            >
              →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
