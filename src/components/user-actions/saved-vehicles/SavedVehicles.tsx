"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Trash2, RefreshCw, AlertCircle } from "lucide-react";
import { useUserActions } from "@/hooks/useUserActions";
import { useAppContext } from "@/context/useAppContext";
import VehicleGrid from "@/components/root/listing/vehicle-grids/VehicleGrid";
import AnimatedSkelton from "@/components/skelton/AnimatedSkelton";
import type { SavedVehicle } from "@/lib/api/userActions.api.types";

interface SavedVehiclesProps {
  className?: string;
}

const SavedVehicles: React.FC<SavedVehiclesProps> = ({ className = "" }) => {
  const { auth } = useAppContext();
  const { user, authStorage } = auth;
  const [visibleVehicleIds, setVisibleVehicleIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const userId = user?.id || authStorage.getUser()?.id;

  // Use the useUserActions hook
  const { useUserSavedVehicles, removeFromSaved, removeFromSavedMutation } =
    useUserActions();

  const {
    data: savedVehicles,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useUserSavedVehicles({
    userId: userId!,
    enabled: !!userId,
    page,
    limit: 20,
  });

  // Transform saved vehicles data to match VehicleListSection format
  const transformedVehicles = React.useMemo(() => {
    if (!savedVehicles?.length) return {};

    // Group vehicles by location (using vehicleId as key for simplicity)
    const grouped: Record<string, any[]> = {
      "saved-vehicles": savedVehicles.map((saved: SavedVehicle) => ({
        ...saved.vehicle,
        savedAt: saved.savedAt,
        savedId: saved.id,
      })),
    };

    return grouped;
  }, [savedVehicles]);

  const handleRemoveFromSaved = async (vehicleId: string) => {
    try {
      await removeFromSaved(vehicleId);
    } catch (error) {
      console.error("Failed to remove from saved:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!userId) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6 text-center">
          <p className="text-gray-600">
            Please log in to view your saved vehicles.
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
              <Heart className="h-6 w-6 text-red-600" />
              Your Saved Vehicles
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
            <p>Failed to load saved vehicles</p>
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

  if (!savedVehicles?.length) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Heart className="h-6 w-6 text-red-600" />
              Your Saved Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <Heart className="h-12 w-12 text-gray-300" />
              <div>
                <p className="mb-2 text-lg font-medium text-gray-900">
                  No Saved Vehicles Yet
                </p>
                <p className="text-gray-600">
                  Save vehicles you&apos;re interested in to view them here
                  later.
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
              <Heart className="h-6 w-6 text-red-600" />
              Your Saved Vehicles
              <Badge variant="secondary" className="bg-red-50 text-red-700">
                {savedVehicles.length}{" "}
                {savedVehicles.length === 1 ? "Vehicle" : "Vehicles"}
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

      {/* Vehicle List using VehicleGrid */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <VehicleGrid
            vehicles={transformedVehicles}
            state="saved-vehicles"
            category="cars"
            country="ae"
            setVisibleVehicleIds={setVisibleVehicleIds}
          />
        </CardContent>
      </Card>

      {/* Saved Vehicle Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Manage Saved Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {savedVehicles.map((saved: SavedVehicle) => (
              <div
                key={saved.id}
                className="flex items-center justify-between rounded-lg border bg-gray-50 p-4"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {saved.vehicle?.model || "Vehicle"}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Saved on {formatDate(saved.savedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFromSaved(saved.vehicleId)}
                    disabled={removeFromSavedMutation.isPending}
                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SavedVehicles;
