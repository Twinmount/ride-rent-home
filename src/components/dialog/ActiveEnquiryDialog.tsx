"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Clock, MessageSquare } from "lucide-react";

interface ActiveEnquiryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  enquiry: {
    id: string;
    createdAt: string;
    message?: string;
    status: string;
    rentalStartDate?: string;
    rentalEndDate?: string;
  };
  vehicleName: string;
}

const ActiveEnquiryDialog = ({
  isOpen,
  onClose,
  enquiry,
  vehicleName,
}: ActiveEnquiryDialogProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-green-100 text-green-800";
      case "agentview":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Active Enquiry Found
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            You already have an active enquiry for {vehicleName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Enquiry Status */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" aria-hidden="true" />
            <span className="text-sm text-gray-600">Status:</span>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                enquiry.status
              )}`}
            >
              {enquiry.status}
            </span>
          </div>

          {/* Enquiry Date */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" aria-hidden="true" />
            <span className="text-sm text-gray-600">Submitted:</span>
            <span className="text-sm font-medium">
              {formatDate(enquiry.createdAt)}
            </span>
          </div>

          {/* Rental Dates if available */}
          {enquiry.rentalStartDate && enquiry.rentalEndDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" aria-hidden="true" />
              <span className="text-sm text-gray-600">Rental Period:</span>
              <span className="text-sm font-medium">
                {formatDate(enquiry.rentalStartDate)} -{" "}
                {formatDate(enquiry.rentalEndDate)}
              </span>
            </div>
          )}

          {/* Message if available */}
          {enquiry.message && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare
                  className="h-4 w-4 text-gray-500"
                  aria-hidden="true"
                />
                <span className="text-sm text-gray-600">Your Message:</span>
              </div>
              <div className="rounded-md bg-gray-50 p-3">
                <p className="text-sm text-gray-800">{enquiry.message}</p>
              </div>
            </div>
          )}

          {/* Information Message */}
          <div className="rounded-md bg-blue-50 p-3">
            <p className="text-sm text-blue-800">
              Please wait for the agent to respond to your enquiry. You can
              check the status and details in your profile.
            </p>
          </div>
        </div>

        <div className="flex justify-between gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            aria-label="Close enquiry dialog"
          >
            Close
          </Button>
          <Link href="/user-profile/enquired-vehicles" className="flex-1">
            <Button
              className="w-full"
              onClick={onClose}
              aria-label="View all your enquiries"
            >
              View All Enquiries
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActiveEnquiryDialog;
