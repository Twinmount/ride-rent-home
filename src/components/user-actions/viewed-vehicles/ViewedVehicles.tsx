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
} from "lucide-react";
import Link from "next/link";

const ViewedVehicles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");

  // Mock viewed vehicles data
  const viewedVehicles = [
    {
      id: 1,
      name: "Ferrari 296 GTB 2024",
      vendor: "Prestige Car Rental",
      price: 1200,
      rating: 4.9,
      location: "Dubai",
      image: "/red-sports-car-racing-style-lightning-mcqueen.png",
      viewedDate: "2 hours ago",
      viewCount: 3,
      category: "sports",
      features: ["Supercar", "Track Ready", "Premium Insurance"],
    },
    {
      id: 2,
      name: "Range Rover Vogue 2023",
      vendor: "Luxury Motors UAE",
      price: 450,
      rating: 4.8,
      location: "Dubai",
      image: "/bmw-x5-luxury-suv.png",
      viewedDate: "1 day ago",
      viewCount: 2,
      category: "suv",
      features: ["Luxury", "Off-road", "Chauffeur Available"],
    },
    {
      id: 3,
      name: "Porsche 911 Turbo S",
      vendor: "Elite Sports Cars",
      price: 800,
      rating: 4.9,
      location: "Abu Dhabi",
      image: "/orange-mclaren-720s-supercar.png",
      viewedDate: "3 days ago",
      viewCount: 1,
      category: "sports",
      features: ["High Performance", "Track Package", "Carbon Fiber"],
    },
    {
      id: 4,
      name: "Mercedes S-Class 2024",
      vendor: "Premium Rentals",
      price: 380,
      rating: 4.7,
      location: "Dubai",
      image: "/white-mercedes-benz-c300-amg-luxury-car.png",
      viewedDate: "1 week ago",
      viewCount: 2,
      category: "luxury",
      features: ["Business Class", "Massage Seats", "WiFi"],
    },
  ];

  const filteredVehicles = viewedVehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterBy === "all" || vehicle.category === filterBy;
    return matchesSearch && matchesFilter;
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

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
            >
              <div className="relative">
                <img
                  src={vehicle.image || "/placeholder.svg"}
                  alt={vehicle.name}
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
                    Viewed {vehicle.viewCount}x
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {vehicle.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400 h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">
                      {vehicle.rating}
                    </span>
                  </div>
                </div>
                <p className="mb-3 text-sm text-gray-600">{vehicle.vendor}</p>
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {vehicle.location}
                  </span>
                  <Clock className="ml-2 h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {vehicle.viewedDate}
                  </span>
                </div>
                <div className="mb-4 flex flex-wrap gap-1">
                  {vehicle.features.slice(0, 2).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-orange-600">
                      {vehicle.price} AED
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

        {filteredVehicles.length === 0 && (
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
