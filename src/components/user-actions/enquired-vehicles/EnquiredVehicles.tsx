"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useUserActions } from "@/hooks/useUserActions";
import { useAppContext } from "@/context/useAppContext";
import VehicleListSection from "@/components/root/listing/vehicle-grids/VehicleListSection";
import AnimatedSkelton from "@/components/skelton/AnimatedSkelton";
import type { EnquiredVehicle } from "@/lib/api/userActions.api.types";

interface EnquiredVehiclesProps {
  className?: string;
}

const EnquiredVehicles: React.FC<EnquiredVehiclesProps> = ({
  className = "",
}) => {
  const { auth } = useAppContext();
  const { user, authStorage } = auth;
  const [visibleVehicleIds, setVisibleVehicleIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const userId = user?.id || authStorage.getUser()?.id;

  const { useUserEnquiredVehicles } = useUserActions();

  const {
    data: enquiredVehicles,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useUserEnquiredVehicles({
    userId: userId!,
    enabled: !!userId,
    page,
    limit: 20,
  });

  // Transform enquired vehicles data to match VehicleListSection format
  const transformedVehicles = React.useMemo(() => {
    if (!enquiredVehicles?.length) return {};

    // Group vehicles by location (using vehicleId as key for simplicity)
    const grouped: Record<string, any[]> = {
      "enquired-vehicles": enquiredVehicles.map((enquiry: EnquiredVehicle) => ({
        ...enquiry.vehicle,
        enquiryDetails: enquiry.enquiryDetails,
        enquiredAt: enquiry.createdAt,
        enquiryId: enquiry.id,
      })),
    };

    return grouped;
  }, [enquiredVehicles]);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "contacted":
        return (
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            <CheckCircle className="mr-1 h-3 w-3" />
            Contacted
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            <CheckCircle className="mr-1 h-3 w-3" />
            Resolved
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge variant="secondary" className="bg-orange-50 text-orange-700">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!userId) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6 text-center">
          <p className="text-gray-600">
            Please log in to view your enquired vehicles.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-orange-600" />
              Your Enquired Vehicles
            </CardTitle>
          </CardHeader>
        </Card>
        <AnimatedSkelton />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6 text-center">
          <div className="mb-4 flex items-center justify-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p>Failed to load enquired vehicles</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!enquiredVehicles?.length) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-orange-600" />
              Your Enquired Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <MessageSquare className="h-12 w-12 text-gray-300" />
              <div>
                <p className="mb-2 text-lg font-medium text-gray-900">
                  No Enquiries Yet
                </p>
                <p className="text-gray-600">
                  When you enquire about vehicles, theyapos&apos;ll appear here.
                </p>
              </div>
              <Button
                onClick={() => (window.location.href = "/cars")}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                Browse Vehicles
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-orange-600" />
              Your Enquired Vehicles
              <Badge
                variant="secondary"
                className="bg-orange-50 text-orange-700"
              >
                {enquiredVehicles.length}{" "}
                {enquiredVehicles.length === 1 ? "Enquiry" : "Enquiries"}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Enquiry Status Summary */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {["pending", "contacted", "resolved"].map((status) => {
              const count = enquiredVehicles.filter(
                (enquiry: EnquiredVehicle) =>
                  (enquiry.enquiryDetails?.status || "pending") === status
              ).length;

              return (
                <div
                  key={status}
                  className="rounded-lg bg-gray-50 p-4 text-center"
                >
                  <div className="mb-1 text-2xl font-bold text-gray-900">
                    {count}
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {getStatusBadge(status)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle List using VehicleListSection */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <VehicleListSection
            vehicles={transformedVehicles}
            state="enquired-vehicles"
            category="cars"
            country="ae"
            setVisibleVehicleIds={setVisibleVehicleIds}
          />
        </CardContent>
      </Card>

      {/* Enquiry Details */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Enquiry Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enquiredVehicles.map((enquiry: EnquiredVehicle) => (
              <div
                key={enquiry.id}
                className="flex items-center justify-between rounded-lg border bg-gray-50 p-4"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {enquiry.vehicle?.model || "Vehicle"}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Enquired on {formatDate(enquiry.createdAt)}
                  </p>
                  {enquiry.enquiryDetails?.message && (
                    <p className="mt-2 text-sm italic text-gray-700">
                      {enquiry.enquiryDetails.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {enquiry.enquiryDetails?.contactPreference && (
                    <Badge variant="outline" className="text-xs">
                      {enquiry.enquiryDetails.contactPreference}
                    </Badge>
                  )}
                  {getStatusBadge(enquiry.enquiryDetails?.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnquiredVehicles;
