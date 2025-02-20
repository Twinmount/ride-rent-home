"use client";
import Autoplay from "embla-carousel-autoplay";
import React, { useState, useEffect, useRef } from "react";
import { IoSpeedometer } from "react-icons/io5";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  RentalDetails,
  RentalPeriod,
  HourlyRentalPeriod,
} from "@/types/vehicle-details-types";

type RentalDetailsCarouselProps = {
  rentalDetails: RentalDetails;
};

// Type guard to check if the rental period is HourlyRentalPeriod
const isHourlyRentalPeriod = (
  period: RentalPeriod | HourlyRentalPeriod
): period is HourlyRentalPeriod => {
  return (period as HourlyRentalPeriod).minBookingHours !== undefined;
};

const RentalDetailsCarousel = ({
  rentalDetails,
}: RentalDetailsCarouselProps) => {
  const plugin = useRef(Autoplay({ delay: 3500, stopOnInteraction: true }));

  const rentalPeriods = [
    { period: "Hour", details: rentalDetails.hour },
    { period: "Day", details: rentalDetails.day },
    { period: "Week", details: rentalDetails.week },
    { period: "Month", details: rentalDetails.month },
  ].filter((rental) => rental.details.enabled); // Filter enabled rental periods

  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const updateCurrentIndex = () => setCurrentIndex(api.selectedScrollSnap());

    api.on("select", updateCurrentIndex);

    return () => {
      api.off("select", updateCurrentIndex);
    };
  }, [api]);

  return (
    <div className="w-full max-w-full">
      <Carousel
        setApi={setApi}
        opts={{ align: "start" }}
        className="w-full max-w-full"
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={() => plugin.current.play()}
      >
        <CarouselContent className="-ml-4">
          {rentalPeriods.map((rental, index) => (
            <CarouselItem key={index} className="mileage">
              <div className="mileage-box">
                <IoSpeedometer />
                <span className="label">{`${rental.period}ly Rental Rate`}</span>
                <span className="value">
                  {rental.period === "Hour" &&
                  isHourlyRentalPeriod(rental.details)
                    ? `AED ${rental.details.rentInAED} / ${rental.details.minBookingHours} Hrs`
                    : `AED ${rental.details.rentInAED}`}
                </span>
              </div>
              <div className="mileage-box">
                <IoSpeedometer />
                <span className="label">Included mileage limit</span>
                <span className="value">{`${rental.details.mileageLimit} Km`}</span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-2">
        {rentalPeriods.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              currentIndex === index ? "bg-black" : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default RentalDetailsCarousel;
