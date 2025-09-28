"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  ArrowLeft,
  Loader2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useUserActions } from "@/hooks/useUserActions";
import { useAppContext } from "@/context/useAppContext";
import { generateVehicleDetailsUrl } from "@/helpers";
import { useStateAndCategory } from "@/hooks/useStateAndCategory";
// import type { SavedVehicle } from "@/lib/api/userActions.api.types"; // No longer needed

interface SavedVehiclesProps {
  className?: string;
}

const SavedVehicles: React.FC<SavedVehiclesProps> = ({ className = "" }) => {
  const { auth } = useAppContext();
  const { user, authStorage } = auth;
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");
  const [page, setPage] = useState(0);

  const userId = user?.id || authStorage.getUser()?.id;

  // Get current state and category context
  const { state, category, country } = useStateAndCategory();

  // Use the useUserActions hook
  const {
    useUserSavedVehicles,
    extractSavedVehicles,
    removeFromSaved,
    removeFromSavedMutation,
  } = useUserActions();

  const {
    data: savedVehiclesApiResponse,
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

  console.log("savedVehiclesApiResponse: ", savedVehiclesApiResponse);

  // Extract the saved vehicles data using the extraction function
  const savedVehicles = React.useMemo(() => {
    const extracted = savedVehiclesApiResponse
      ? extractSavedVehicles(savedVehiclesApiResponse)
      : [];
    console.log("extractedSavedVehicles: ", extracted);
    return extracted;
  }, [savedVehiclesApiResponse, extractSavedVehicles]);

  // Filter and sort vehicles
  const filteredVehicles = savedVehicles
    .filter((vehicle: any) => {
      const matchesSearch =
        vehicle.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.vendor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.model?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterBy === "all" || vehicle.category === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "recent":
        default:
          return 0; // Keep original order for recent
      }
    });

  // Helper function to generate vehicle details URL
  const getVehicleDetailsUrl = (vehicle: any) => {
    // Use available fields and current state/category from user's context
    const currentState = state || "dubai";
    const currentCategory = category || "cars";
    const vehicleCode = vehicle.vehicleCode || vehicle.id;
    const currentCountry = country || "ae";

    const navRoute = generateVehicleDetailsUrl({
      vehicleTitle: vehicle.name || vehicle.model || "vehicle",
      state: currentState,
      vehicleCategory: currentCategory,
      vehicleCode,
      country: currentCountry,
    });

    return navRoute;
  };

  const handleRemoveFromSaved = async (vehicleId: string) => {
    try {
      await removeFromSaved(vehicleId);
      // Refetch the data after successful removal
      refetch();
    } catch (error) {
      console.error("Failed to remove from saved:", error);
      // Handle the error - for now the API endpoint doesn't exist yet
      alert(
        "Remove from saved functionality is not yet implemented in the backend"
      );
    }
  };

  // Early return if no user is logged in
  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="py-12 text-center">
            <Heart className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Please log in to view your saved vehicles
            </h3>
            <p className="mb-4 text-gray-600">
              Sign in to see the vehicles you&apos;ve saved for later
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-4">
            <Link href="/user-profile">
              <Button variant="ghost" size="sm" className="cursor-pointer">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Profile
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Saved Vehicles
              </h1>
              <p className="text-gray-600">
                Find your Favorites Saved for Later​
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              <span className="text-2xl font-bold text-gray-900">
                {savedVehicles.length}
              </span>
              <span className="text-gray-600">saved</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search your favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full cursor-pointer sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Saved</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-full cursor-pointer sm:w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="sedan">Sedan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
              <span className="text-gray-600">Loading saved vehicles...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Failed to load saved vehicles
            </h3>
            <p className="mb-4 text-gray-600">
              There was an error loading your saved vehicles. Please try again.
            </p>
            {process.env.NODE_ENV === "development" && (
              <p className="mb-4 text-sm text-red-600">
                Error: {error?.message || "Unknown error"}
              </p>
            )}
            <Button
              onClick={() => {
                refetch();
              }}
              className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Vehicles Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle: any) => (
              <Card
                key={vehicle.id}
                className="overflow-hidden transition-shadow hover:shadow-lg"
              >
                <div className="relative">
                  <Link href={getVehicleDetailsUrl(vehicle)}>
                    <div className="cursor-pointer">
                      {vehicle.image ? (
                        <img
                          src={vehicle.image}
                          alt={vehicle.name || "Vehicle"}
                          className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/default-car.png";
                          }}
                        />
                      ) : (
                        <div className="flex h-48 w-full items-center justify-center bg-gray-200">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  {/* <div className="absolute right-3 top-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleRemoveFromSaved(vehicle.id)}
                      disabled={removeFromSavedMutation.isPending}
                      className="h-8 w-8 cursor-pointer bg-white/90 p-0 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                    </Button>
                  </div> */}
                  <div className="absolute left-3 top-3">
                    <Badge className="bg-red-500 text-white">
                      <Heart className="mr-1 h-3 w-3" />
                      Saved
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <Link href={getVehicleDetailsUrl(vehicle)}>
                      <h3 className="cursor-pointer text-sm font-semibold text-gray-900 transition-colors hover:text-orange-600">
                        {vehicle.name || "Unknown Vehicle"}
                      </h3>
                    </Link>
                    {vehicle.vehicleCode && (
                      <Badge variant="outline" className="text-xs">
                        {vehicle.vehicleCode}
                      </Badge>
                    )}
                  </div>
                  <p className="mb-3 text-sm text-gray-600">
                    {vehicle.vendor || vehicle.make || "Premium Car Rental"}
                    {vehicle.year && <span> • {vehicle.year}</span>}
                  </p>
                  <div className="mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {vehicle.location || "Dubai"}
                    </span>
                    <Clock className="ml-2 h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {vehicle.savedDate || "Recently"}
                    </span>
                  </div>
                  <div className="mb-4 flex flex-wrap gap-1">
                    {vehicle.features
                      ?.slice(0, 2)
                      .map((feature: any, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-orange-600">
                        AED {vehicle.price || 0}
                      </span>
                      <span className="text-sm text-gray-500">
                        /{vehicle.priceUnit || "day"}
                      </span>
                    </div>
                    <Link href={getVehicleDetailsUrl(vehicle)}>
                      <Button
                        size="sm"
                        className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !error && filteredVehicles.length === 0 && (
          <div className="py-12 text-center">
            <Heart className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No saved vehicles found
            </h3>
            <p className="mb-4 text-gray-600">
              {searchQuery || filterBy !== "all"
                ? "Try adjusting your search or filters"
                : "Start browsing to save your favorite vehicles"}
            </p>
            <Link href="/">
              <Button className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600">
                Browse Vehicles
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedVehicles;
