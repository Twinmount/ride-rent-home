"use client";
import { useSession } from "next-auth/react";
import { useAuthContext } from "@/auth";
import { checkActiveEnquiry } from "@/lib/api/general-api";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Calendar, MessageSquare, Clock } from "lucide-react";
import Link from "next/link";

interface ActiveEnquiryBannerProps {
  vehicleId: string;
  vehicleName: string;
  country?: string;
}

const ActiveEnquiryBanner = ({
  vehicleId,
  vehicleName,
  country = "ae",
}: ActiveEnquiryBannerProps) => {
  const { data: auth } = useSession();

  const { data: activeEnquiryData, isLoading } = useQuery({
    queryKey: ["activeEnquiry", vehicleId, auth?.user?.id],
    queryFn: () =>
      checkActiveEnquiry({
        carId: vehicleId,
        userId: auth?.user?.id || "",
        country,
      }),
    enabled: !!(vehicleId && auth?.user?.id),
    refetchOnWindowFocus: true,
  });

  if (activeEnquiryData?.result?.hasActiveEnquiry !== true) return;

  const enquiry = activeEnquiryData?.result?.enquiry;

  const enquiryDate = enquiry?.createdAt
    ? new Date(enquiry.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "recently";

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "border-blue-200 bg-blue-50 text-blue-800";
      case "contacted":
        return "border-green-200 bg-green-50 text-green-800";
      case "agentview":
        return "border-yellow-200 bg-yellow-50 text-yellow-800";
      default:
        return "border-gray-200 bg-gray-50 text-gray-800";
    }
  };

  if (isLoading) {
    return null; // or a loading spinner if needed
  }

  return (
    <div
      className={`mb-6 rounded-lg border p-4 ${getStatusColor(
        enquiry?.status || "new"
      )}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              You have an active booking enquiry.
            </h3>
            <span className="rounded-full bg-white bg-opacity-60 px-2 py-1 text-xs font-medium">
              {enquiry?.status || "NEW"}
            </span>
          </div>

          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>Submitted on {enquiryDate}</span>
            </div>

            {enquiry?.rentalStartDate && enquiry?.rentalEndDate && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>
                  {`  Booking Period : `}
                  {new Date(
                    enquiry.rentalStartDate
                  ).toLocaleDateString()} -{" "}
                  {new Date(enquiry.rentalEndDate).toLocaleDateString()}
                </span>
              </div>
            )}

            {enquiry?.message && (
              <div className="flex items-start gap-2 text-sm">
                <MessageSquare className="mt-0.5 h-4 w-4" />
                <span className="line-clamp-2">{enquiry.message}</span>
              </div>
            )}
          </div>

          <div className="mt-3 flex gap-2">
            <Link
              href="/user-profile/enquired-vehicles"
              className="text-sm font-medium underline hover:no-underline"
            >
              View All Enquiries
            </Link>
            <span className="text-sm text-opacity-60">•</span>
            <span className="text-sm">
              The supplier will respond to your enquiry soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveEnquiryBanner;
