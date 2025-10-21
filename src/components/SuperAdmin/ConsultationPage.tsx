"use client";
import { Card, CardContent } from "@/components/ui/card";
import {  MoreHorizontal} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
type DropdownId = number | null;
export default function ConsultationPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalConsultations = 24;
  const consultationsPerPage = 10;
  const totalPages = Math.ceil(totalConsultations / consultationsPerPage);

  // Generate mock consultation data
  const consultations = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    date: "10/09/25",
    courseName: "Foundations of the Faith",
    studentName: "Charli Falcon",
    duration: "30:00",
    price: 19,
    status: i % 3 === 0 ? 'cancelled' : (i % 2 === 0 ? 'completed' : 'pending'),
    action: true,
  }));

  // Get current page consultations
  const indexOfLastConsultation = currentPage * consultationsPerPage;
  const indexOfFirstConsultation = indexOfLastConsultation - consultationsPerPage;
  const currentConsultations = consultations.slice(indexOfFirstConsultation, indexOfLastConsultation);

  // Pagination handlers
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Dropdown state
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h1 className="text-2xl font-bold">All Consultation</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Admin</span>
          <Avatar className="w-8 h-8">
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[
            {
              title: "Total Consultation",
              value: "24",
              bg: "bg-blue-100",
              border: "border-blue-300",
            },
            {
              title: "Completed",
              value: "12",
              bg: "bg-white",
              border: "border-gray-200",
            },
            {
              title: "Cancelled",
              value: "11",
              bg: "bg-white",
              border: "border-gray-200",
            },
          ].map((card, index) => (
            <Card key={index} className={`${card.bg} ${card.border} border`}>
              <CardContent className="py-8 text-center">
                <p className="text-lg font-medium text-gray-700 mb-1">
                  {card.title}
                </p>
                <p className="text-xl font-bold text-gray-900">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Consultation Button (optional) */}
        {/* <div className="flex justify-end mb-6">
          <Button className="bg-blue-600 px-4 py-2 hover:bg-blue-700 text-white gap-2">
            <Plus size={20} />
            Add Consultation
          </Button>
        </div> */}

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Course Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Student Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Price
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentConsultations.map((consult) => (
                  <tr key={consult.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{consult.date}</td>
                    <td className="px-4 py-3 text-sm">{consult.courseName}</td>
                    <td className="px-4 py-3 text-sm">{consult.studentName}</td>
                    <td className="px-4 py-3 text-sm">{consult.duration}</td>
                    <td className="px-4 py-3 text-sm">${consult.price}</td>
                    <td className="px-4 py-3 text-center relative">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          className="text-gray-400 hover:text-gray-600 relative"
                          onClick={() => setOpenDropdown(openDropdown === consult.id ? null : consult.id)}
                        >
                          <MoreHorizontal size={18} />
                          {openDropdown === consult.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                              <button 
                                className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdown(null);
                                  import('sweetalert2').then(({ default: Swal }) => {
                                    Swal.fire({
                                      title: 'Update Consultation',
                                      text: `Are you sure you want to update consultation #${consult.id}?`,
                                      icon: 'info',
                                      showCancelButton: true,
                                      confirmButtonText: 'Yes, update it!',
                                      cancelButtonText: 'Cancel',
                                      confirmButtonColor: '#3B82F6',
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        Swal.fire('Updated!', `Consultation #${consult.id} has been updated.`, 'success');
                                      }
                                    });
                                  });
                                }}
                              >
                                Update
                              </button>
                              <button 
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdown(null);
                                  import('sweetalert2').then(({ default: Swal }) => {
                                    Swal.fire({
                                      title: 'Are you sure?',
                                      text: `You won't be able to revert the deletion of consultation #${consult.id}!`,
                                      icon: 'warning',
                                      showCancelButton: true,
                                      confirmButtonText: 'Yes, delete it!',
                                      cancelButtonText: 'No, cancel',
                                      confirmButtonColor: '#EF4444',
                                      reverseButtons: true,
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        Swal.fire('Deleted!', `Consultation #${consult.id} has been deleted.`, 'success');
                                      }
                                    });
                                  });
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </button>
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
          <button 
            className="px-3 py-2 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
          </button>
          
          {currentPage > 3 && (
            <>
              <button 
                className="px-3 py-2 text-sm border rounded hover:bg-gray-50"
                onClick={() => paginate(1)}
              >
                1
              </button>
              <span className="px-2 text-sm text-gray-500">...</span>
            </>
          )}

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return pageNum;
          }).map((pageNum) => (
            <button 
              key={pageNum}
              className={`px-3 py-2 text-sm rounded ${
                currentPage === pageNum 
                  ? 'bg-blue-600 text-white' 
                  : 'border hover:bg-gray-50'
              }`}
              onClick={() => paginate(pageNum)}
            >
              {pageNum}
            </button>
          ))}

          {currentPage < totalPages - 2 && (
            <>
              <span className="px-2 text-sm text-gray-500">...</span>
              <button 
                className="px-3 py-2 text-sm border rounded hover:bg-gray-50"
                onClick={() => paginate(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}

          <button 
            className="px-3 py-2 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 14.646a.5.5 0 0 1 .708 0l6-6a.5.5 0 0 1 0-.708l-6-6a.5.5 0 0 1-.708.708L10.293 8 4.646 13.646a.5.5 0 0 1 0 .708z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}