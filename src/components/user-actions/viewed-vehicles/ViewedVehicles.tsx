"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, RefreshCw, AlertCircle } from "lucide-react";
import { useUserViewedVehicles } from "@/hooks/useUserActions";
import { useAppContext } from "@/context/useAppContext";
import VehicleListSection from "@/components/root/listing/vehicle-grids/VehicleGrid";
import AnimatedSkelton from "@/components/skelton/AnimatedSkelton";
import type { ViewedVehicle } from "@/lib/api/userActions.api.types";

interface ViewedVehiclesProps {
  className?: string;
}

const ViewedVehicles: React.FC<ViewedVehiclesProps> = ({ className = "" }) => {
  const { auth } = useAppContext();
  const { user, authStorage } = auth;
  const [visibleVehicleIds, setVisibleVehicleIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const userId = user?.id || authStorage.getUser()?.id;

  const {
    data: viewedVehicles,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useUserViewedVehicles({
    userId: userId!,
    enabled: !!userId,
    page,
    limit: 20,
  });

  // Transform viewed vehicles data to match VehicleListSection format
  const transformedVehicles = React.useMemo(() => {
    if (!viewedVehicles?.length) return {};

    // Group vehicles by location (using vehicleId as key for simplicity)
    const grouped: Record<string, any[]> = {
      "viewed-vehicles": viewedVehicles.map((viewed: ViewedVehicle) => ({
        ...viewed.vehicle,
        lastViewedAt: viewed.lastViewedAt,
        viewDuration: viewed.viewDuration,
        viewId: viewed.id,
      })),
    };

    return grouped;
  }, [viewedVehicles]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds || seconds < 60) {
      return `${seconds || 0}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  };

  if (!userId) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6 text-center">
          <p className="text-gray-600">
            Please log in to view your browsing history.
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
              <Eye className="h-6 w-6 text-purple-600" />
              Recently Viewed Vehicles
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
            <p>Failed to load viewed vehicles</p>
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

  if (!viewedVehicles?.length) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Eye className="h-6 w-6 text-purple-600" />
              Recently Viewed Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <Eye className="h-12 w-12 text-gray-300" />
              <div>
                <p className="mb-2 text-lg font-medium text-gray-900">
                  No Browsing History
                </p>
                <p className="text-gray-600">
                  Vehicles you view will appear here for easy access.
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

  // Group views by time period
  const today = viewedVehicles.filter((viewed) => {
    const viewDate = new Date(viewed.lastViewedAt);
    const now = new Date();
    return viewDate.toDateString() === now.toDateString();
  });

  const yesterday = viewedVehicles.filter((viewed) => {
    const viewDate = new Date(viewed.lastViewedAt);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return viewDate.toDateString() === yesterday.toDateString();
  });

  const older = viewedVehicles.filter((viewed) => {
    const viewDate = new Date(viewed.lastViewedAt);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return viewDate < yesterday;
  });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="h-6 w-6 text-purple-600" />
              Recently Viewed Vehicles
              <Badge
                variant="secondary"
                className="bg-purple-50 text-purple-700"
              >
                {viewedVehicles.length}{" "}
                {viewedVehicles.length === 1 ? "Vehicle" : "Vehicles"}
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

      {/* Viewing Statistics */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-4 text-center">
              <div className="mb-1 text-2xl font-bold text-blue-900">
                {today.length}
              </div>
              <div className="text-sm text-blue-700">Today</div>
            </div>
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <div className="mb-1 text-2xl font-bold text-green-900">
                {yesterday.length}
              </div>
              <div className="text-sm text-green-700">Yesterday</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <div className="mb-1 text-2xl font-bold text-gray-900">
                {older.length}
              </div>
              <div className="text-sm text-gray-700">Older</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle List using VehicleListSection */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <VehicleListSection
            vehicles={transformedVehicles}
            state="viewed-vehicles"
            category="cars"
            country="ae"
            setVisibleVehicleIds={setVisibleVehicleIds}
          />
        </CardContent>
      </Card>

      {/* Viewing Details */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Viewing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {viewedVehicles.map((viewed: ViewedVehicle) => (
              <div
                key={viewed.id}
                className="flex items-center justify-between rounded-lg border bg-gray-50 p-4"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {viewed.vehicle?.model || "Vehicle"}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Viewed {formatDate(viewed.lastViewedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {viewed.viewDuration && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 text-xs"
                    >
                      <Clock className="h-3 w-3" />
                      {formatDuration(viewed.viewDuration)}
                    </Badge>
                  )}
                  <Badge
                    variant="secondary"
                    className="bg-purple-50 text-purple-700"
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Viewed
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewedVehicles;
