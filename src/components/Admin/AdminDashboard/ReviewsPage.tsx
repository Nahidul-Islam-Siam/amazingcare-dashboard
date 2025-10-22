/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Swal from 'sweetalert2';
import { useState } from "react";

export default function ReviewsPage() {
  const [selectedReview, setSelectedReview] = useState(null);

  // Mock reviews data matching your image
  const reviews = [
    {
      id: 1,
      user: "Jenny Wilson",
      avatar: "/avatars/jenny.jpg",
      review: "This course was excellent! I learned so much about modern design principles and best practices.",
      rating: 5,
      date: "10/09/25"
    },
    {
      id: 2,
      user: "Cody Fisher",
      avatar: "/avatars/cody.jpg",
      review: "Great content and very well structured. The quizzes helped reinforce learning.",
      rating: 4,
      date: "10/08/25"
    },
    {
      id: 3,
      user: "Albert Flores",
      avatar: "/avatars/albert.jpg",
      review: "Could be better. Some sections were too fast-paced without enough examples.",
      rating: 3,
      date: "10/07/25"
    },
    {
      id: 4,
      user: "Kristin Watson",
      avatar: "/avatars/kristin.jpg",
      review: "Outstanding teaching style! Highly recommend for beginners.",
      rating: 5,
      date: "10/06/25"
    },
    {
      id: 5,
      user: "Floyd Miles",
      avatar: "/avatars/floyd.jpg",
      review: "Not worth the price. Lacked depth in advanced topics.",
      rating: 2,
      date: "10/05/25"
    },
    {
      id: 6,
      user: "Annette Black",
      avatar: "/avatars/annette.jpg",
      review: "Perfect balance of theory and hands-on practice.",
      rating: 5,
      date: "10/04/25"
    },
  ];

  // Handle Delete with SweetAlert
  const handleDelete = async (id: number, user: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the review from "${user}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'border-2 border-red-200 rounded-lg shadow-xl',
        confirmButton: 'bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md',
        cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md'
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      try {
        await Swal.fire({
          title: 'Deleted!',
          text: `Review from "${user}" has been removed.`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: 'border-2 border-green-200 rounded-lg shadow-xl'
          }
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete review.',
          icon: 'error',
          customClass: {
            popup: 'border-2 border-red-200 rounded-lg shadow-xl'
          }
        });
      }
    }
  };

  // Show Full Review Modal
  const openReviewModal = (review: any) => {
    setSelectedReview(review);
    Swal.fire({
      title: `Review by ${review.user}`,
      html: `
        <div class="text-left p-4">
          <div class="flex items-center gap-3 mb-4">
            <img src="${review.avatar}" alt="${review.user}" class="w-10 h-10 rounded-full object-cover" />
            <div>
              <p class="font-semibold text-gray-900">${review.user}</p>
              <p class="text-sm text-yellow-500">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</p>
            </div>
          </div>
          <p class="text-gray-700 mb-2"><strong>Date:</strong> ${review.date}</p>
          <p class="text-gray-800 leading-relaxed">${review.review}</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white">
        <h1 className="text-2xl font-bold text-gray-900">All Reviews</h1>
        <Button variant="outline" size="icon" className="border-gray-300">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              title: "Total Reviews",
              value: "1248",
              bg: "bg-[var(--brand-tints,#DDE7FE)]",
              border: "border-[var(--semi-brand,#398EFD)]",
            },
            {
              title: "Avg Rating",
              value: "4.5",
              bg: "bg-white",
              border: "border-[var(--brand-tints,#DDE7FE)]",
            },
          ].map((card, index) => (
            <Card key={index} className={`${card.bg} ${card.border} border`}>
              <CardContent className="py-8 text-center">
                <p className="text-lg font-medium text-gray-700 mb-1">{card.title}</p>
                <p className="text-xl font-bold text-gray-900">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">User</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Review</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Rating</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id} className="border-t hover:bg-gray-50">
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 ring-1 ring-gray-200">
                          <AvatarImage src={review.avatar} alt={review.user} />
                          <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{review.user}</span>
                      </div>
                    </td>

                    {/* Review Preview */}
                    <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-xs">
                      {review.review}
                    </td>

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
                    <td className="px-4 py-3 text-sm">{review.date}</td>

                    {/* Action */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openReviewModal(review)}
                          className="text-blue-600 hover:text-blue-800 border-blue-200 text-xs font-medium"
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(review.id, review.user)}
                          className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 text-xs font-medium"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-start gap-1 mt-6">
          <Button variant="outline" size="sm" className="px-3 py-2">←</Button>
          <Button size="sm" className="px-3 py-2 bg-blue-600 text-white font-semibold">1</Button>
          <Button variant="outline" size="sm" className="px-3 py-2">2</Button>
          <span className="px-2 text-sm text-gray-500">...</span>
          <Button variant="outline" size="sm" className="px-3 py-2">9</Button>
          <Button variant="outline" size="sm" className="px-3 py-2">10</Button>
          <Button variant="outline" size="sm" className="px-3 py-2">→</Button>
        </div>
      </div>
    </div>
  );
}