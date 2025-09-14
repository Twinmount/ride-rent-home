"use client";

import { useState } from "react";
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
  Eye,
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  Heart,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useUserActions } from "@/hooks/useUserActions";

const ViewedVehicles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");

  // Use the useUserActions hook
  const { useUserViewedVehicles, extractViewedVehicles } = useUserActions();

  // Get viewed vehicles data - only call when this component is mounted
  const viewedVehiclesQuery = useUserViewedVehicles({
    page: 0,
    limit: 20,
    sortOrder: "DESC",
    enabled: true, // Explicitly enable the query when this page loads
  });

  // Use the viewed vehicles data directly
  const viewedVehicles = viewedVehiclesQuery.data
    ? extractViewedVehicles(viewedVehiclesQuery.data)
    : [];

  const isLoading = viewedVehiclesQuery.isLoading;

  // Filter and sort vehicles
  const filteredVehicles = viewedVehicles
    .filter((vehicle: any) => {
      const matchesSearch =
        vehicle.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.vendor?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterBy === "all" || vehicle.category === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "most-viewed":
          return (b.viewCount || 0) - (a.viewCount || 0);
        case "recent":
        default:
          return 0; // Keep original order for recent
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-4">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="cursor-pointer">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Profile
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Recently Viewed
              </h1>
              <p className="text-gray-600">Vehicles you've recently browsed</p>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-6 w-6 text-purple-500" />
              <span className="text-2xl font-bold text-gray-900">
                {viewedVehicles.length}
              </span>
              <span className="text-gray-600">viewed</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search viewed vehicles..."
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
              <SelectItem value="recent">Recently Viewed</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="most-viewed">Most Viewed</SelectItem>
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
              <span className="text-gray-600">Loading viewed vehicles...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {viewedVehiclesQuery.error && !isLoading && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Eye className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Failed to load viewed vehicles
            </h3>
            <p className="mb-4 text-gray-600">
              There was an error loading your viewing history. Please try again.
            </p>
            <Button
              onClick={() => {
                viewedVehiclesQuery.refetch();
              }}
              className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Vehicles Grid */}
        {!isLoading && !viewedVehiclesQuery.error && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle: any) => (
              <Card
                key={vehicle.id}
                className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
              >
                <div className="relative">
                  <img
                    src={vehicle.image || "/placeholder.svg"}
                    alt={vehicle.name || "Vehicle"}
                    className="h-48 w-full object-cover"
                  />
                  <div className="absolute right-3 top-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 cursor-pointer bg-white/90 p-0 hover:bg-red-50"
                    >
                      <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                    </Button>
                  </div>
                  <div className="absolute left-3 top-3">
                    <Badge className="bg-purple-500 text-white">
                      <Eye className="mr-1 h-3 w-3" />
                      Viewed {vehicle.viewCount || 1}x
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {vehicle.name || "Unknown Vehicle"}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-400 h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">
                        {vehicle.rating || 4.5}
                      </span>
                    </div>
                  </div>
                  <p className="mb-3 text-sm text-gray-600">
                    {vehicle.vendor || "Premium Car Rental"}
                  </p>
                  <div className="mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {vehicle.location || "Dubai"}
                    </span>
                    <Clock className="ml-2 h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {vehicle.viewedDate || "Recently"}
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
                        {vehicle.price || 0} AED
                      </span>
                      <span className="text-sm text-gray-500">/day</span>
                    </div>
                    <Button
                      size="sm"
                      className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
                    >
                      View Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading &&
          !viewedVehiclesQuery.error &&
          filteredVehicles.length === 0 && (
            <div className="py-12 text-center">
              <Eye className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                No viewed vehicles found
              </h3>
              <p className="mb-4 text-gray-600">
                {searchQuery || filterBy !== "all"
                  ? "Try adjusting your search or filters"
                  : "Start browsing to see your viewing history"}
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

export default ViewedVehicles;
