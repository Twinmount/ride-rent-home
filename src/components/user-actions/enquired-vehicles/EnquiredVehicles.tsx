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
  MessageSquare,
  Search,
  Filter,
  Star,
  MapPin,
  Calendar,
  Phone,
  Mail,
  ArrowLeft,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function EnquiredVehiclesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");

  // Mock enquired vehicles data
  const enquiredVehicles = [
    {
      id: 1,
      name: "Lamborghini Huracan 2024",
      vendor: "Supercar Rentals Dubai",
      price: 1500,
      rating: 4.9,
      location: "Dubai",
      image: "/orange-mclaren-720s-supercar.png",
      enquiredDate: "2 days ago",
      status: "pending",
      responseTime: "Usually responds within 2 hours",
      category: "sports",
      enquiryDetails: {
        dates: "Dec 15-17, 2024",
        duration: "3 days",
        message: "Looking for weekend rental with delivery to hotel",
      },
    },
    {
      id: 2,
      name: "Rolls Royce Ghost 2023",
      vendor: "Platinum Car Hire",
      price: 2000,
      rating: 5.0,
      location: "Dubai",
      image: "/black-ford-mustang-gt-muscle-car.png",
      enquiredDate: "1 week ago",
      status: "responded",
      responseTime: "Responded in 30 minutes",
      category: "luxury",
      enquiryDetails: {
        dates: "Dec 20-25, 2024",
        duration: "5 days",
        message: "Need for business meetings and airport transfers",
      },
    },
    {
      id: 3,
      name: "McLaren 720S Spider",
      vendor: "Elite Supercars",
      price: 1800,
      rating: 4.8,
      location: "Abu Dhabi",
      image: "/red-sports-car-racing-style-lightning-mcqueen.png",
      enquiredDate: "2 weeks ago",
      status: "booked",
      responseTime: "Booking confirmed",
      category: "sports",
      enquiryDetails: {
        dates: "Nov 28-30, 2024",
        duration: "2 days",
        message: "Special occasion rental with track day package",
      },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "responded":
        return "bg-blue-100 text-blue-800";
      case "booked":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "responded":
        return <Mail className="h-3 w-3" />;
      case "booked":
        return <Calendar className="h-3 w-3" />;
      default:
        return <MessageSquare className="h-3 w-3" />;
    }
  };

  const filteredVehicles = enquiredVehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterBy === "all" || vehicle.status === filterBy;
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
                My Enquiries
              </h1>
              <p className="text-gray-600">
                Track your rental enquiries and responses
              </p>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-500" />
              <span className="text-2xl font-bold text-gray-900">
                {enquiredVehicles.length}
              </span>
              <span className="text-gray-600">enquiries</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search enquiries..."
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
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-full cursor-pointer sm:w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="responded">Responded</SelectItem>
              <SelectItem value="booked">Booked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Enquiries List */}
        <div className="space-y-6">
          {filteredVehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className="overflow-hidden transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 lg:flex-row">
                  {/* Vehicle Image */}
                  <div className="flex-shrink-0 lg:w-64">
                    <img
                      src={vehicle.image || "/placeholder.svg"}
                      alt={vehicle.name}
                      className="h-40 w-full rounded-lg object-cover lg:h-32"
                    />
                  </div>

                  {/* Vehicle Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="mb-1 text-xl font-semibold text-gray-900">
                          {vehicle.name}
                        </h3>
                        <p className="mb-2 text-gray-600">{vehicle.vendor}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {vehicle.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="text-yellow-400 h-4 w-4 fill-current" />
                            {vehicle.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {vehicle.enquiredDate}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="mb-1 text-2xl font-bold text-orange-600">
                          {vehicle.price} AED
                          <span className="text-sm font-normal text-gray-500">
                            /day
                          </span>
                        </div>
                        <Badge
                          className={`${getStatusColor(vehicle.status)} capitalize`}
                        >
                          {getStatusIcon(vehicle.status)}
                          <span className="ml-1">{vehicle.status}</span>
                        </Badge>
                      </div>
                    </div>

                    {/* Enquiry Details */}
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="mb-2 font-medium text-gray-900">
                        Enquiry Details
                      </h4>
                      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                        <div>
                          <span className="text-gray-500">Rental Dates:</span>
                          <p className="font-medium">
                            {vehicle.enquiryDetails.dates}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <p className="font-medium">
                            {vehicle.enquiryDetails.duration}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Response Time:</span>
                          <p className="font-medium">{vehicle.responseTime}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-gray-500">Message:</span>
                        <p className="mt-1 text-gray-900">
                          {vehicle.enquiryDetails.message}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {/* {vehicle.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="cursor-pointer bg-transparent"
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            Call Vendor
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="cursor-pointer bg-transparent"
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Send Message
                          </Button>
                        </>
                      )} */}
                      {/* {vehicle.status === "responded" && (
                        <>
                          <Button
                            size="sm"
                            className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
                          >
                            View Response
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="cursor-pointer bg-transparent"
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            Call Vendor
                          </Button>
                        </>
                      )}
                      {vehicle.status === "booked" && (
                        <>
                          <Button
                            size="sm"
                            className="cursor-pointer bg-green-500 text-white hover:bg-green-600"
                          >
                            View Booking
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="cursor-pointer bg-transparent"
                          >
                            Download Receipt
                          </Button>
                        </>
                      )} */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="py-12 text-center">
            <MessageSquare className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No enquiries found
            </h3>
            <p className="mb-4 text-gray-600">
              {searchQuery || filterBy !== "all"
                ? "Try adjusting your search or filters"
                : "Start browsing vehicles and make your first enquiry"}
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
}
