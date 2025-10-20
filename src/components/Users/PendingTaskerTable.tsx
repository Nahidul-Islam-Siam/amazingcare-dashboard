"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PendingTasker {
  driverId: string;
  driverName: string;
  /** Optional link to a PDF or doc */
  docUrl?: string;
}

export default function PendingTaskerTable({
  pendingTaskers,
  onApprove,
  onCancel,
}: {
  pendingTaskers: PendingTasker[];
  onApprove: (index: number) => void;
  onCancel: (index: number) => void;
}) {
  // which row and action we’re confirming
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "cancel" | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openModal = (index: number, type: "approve" | "cancel") => {
    setSelectedIndex(index);
    setActionType(type);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    if (selectedIndex !== null && actionType) {
      if (actionType === "approve") {
        onApprove(selectedIndex);
      } else {
        onCancel(selectedIndex);
      }
    }
    setModalOpen(false);
    setSelectedIndex(null);
    setActionType(null);
  };

  return (
    <>
      <Card className="rounded-[12px] border  bg-[rgba(255,211,0,0.10)] p-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-900">
            Pending Taskers
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-yellow-50">
                <tr className="border-b border-gray-300">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Driver ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Driver Name
                  </th>
                  {/* columns for PDF / Approve / Cancel */}
                  <th className="py-3 px-2" />
                  <th className="py-3 px-2" />
                  <th className="py-3 px-2" />
                </tr>
              </thead>

              <tbody className="bg-yellow-50">
                {pendingTaskers.map((tasker, index) => {
                  const docs = tasker.docUrl;

                  return (
                    <tr
                      key={`${tasker.driverId}-${index}`}
                      className="border-b border-yellow-200/70 last:border-0"
                    >
                      <td className="py-3 px-4 text-gray-900 whitespace-nowrap">
                        {tasker.driverId}
                      </td>
                      <td className="py-3 px-4 text-gray-900">{tasker.driverName}</td>

                      {/* PDF badge / link */}
                      <td className="py-3 px-2">
                        {docs ? (
                          <Link
                            href={docs}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-[10px] font-semibold tracking-wide text-gray-700 hover:bg-gray-100"
                            title="View documents (PDF)"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>PDF</span>
                          </Link>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white/70 px-2 py-1 text-[10px] font-semibold tracking-wide text-gray-400 cursor-not-allowed"
                            title="No document"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>PDF</span>
                          </span>
                        )}
                      </td>

                      {/* Approve pill */}
                      <td className="py-3 px-2">
                        <Button
                          size="sm"
                          onClick={() => openModal(index, "approve")}
                          className="rounded-full px-5 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white"
                        >
                          Approve
                        </Button>
                      </td>

                      {/* Cancel outlined red */}
                      <td className="py-3 px-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openModal(index, "cancel")}
                          className="rounded-lg px-5 py-1.5 text-sm bg-white border-2 border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Cancel
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-sm bg-white rounded-xl shadow-lg p-6 text-center">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {actionType === "approve"
                ? "Do you want to approve this tasker?"
                : "Do you want to cancel this tasker?"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-center gap-4 mt-6">
            <Button
              className="bg-green-500 hover:bg-green-600 text-white px-6"
              onClick={handleConfirm}
            >
              Yes
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white px-6"
              onClick={() => setModalOpen(false)}
            >
              No
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
