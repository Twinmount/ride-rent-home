'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Plus } from "lucide-react";

type ViewAllGridCardProps = {
  thumbnails: string[];
  viewAllLink: string;
  totalCount: number;
  label: string;
  disableInternalAnimation?: boolean;
};

const ViewAllGridCard = ({
  thumbnails,
  viewAllLink,
  totalCount,
  label,
  disableInternalAnimation = false,
}: ViewAllGridCardProps) => {
  const placeholder = "/assets/img/placeholder/vehicle-grid-placeholder.webp";
  const [isVisible, setIsVisible] = useState(false);

  // Fill thumbnails to ensure we always have 4
  const filledThumbnails = [
    ...thumbnails,
    ...Array(4 - thumbnails.length).fill(placeholder),
  ];

  useEffect(() => {
    if (disableInternalAnimation) {
      setIsVisible(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [disableInternalAnimation]);

  const isLargeNumber = totalCount >= 1000;

  return (
    <div className="flex items-center">
      <Link
        href={viewAllLink}
        className={`group relative flex h-[12rem] w-[10rem] min-w-[10rem] cursor-pointer flex-col gap-2 rounded border border-border-default bg-white p-2 transition-all duration-500 hover:border-yellow hover:shadow-lg md:w-[10.5rem] md:min-w-[10.5rem] lg:w-[11rem] lg:min-w-[11rem] ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        aria-label={`View all ${totalCount} ${label} vehicles`}
      >
        {/* Thumbnail grid */}
        <div className="relative grid h-auto min-h-[75%] grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-lg border">
          {filledThumbnails.slice(0, 4).map((url, idx) => (
            <div
              key={idx}
              className={`overflow-hidden rounded-[0.2rem] transition-all duration-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <img
                src={url}
                alt={`Vehicle ${idx + 1}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-yellow/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}

          {/* Center badge - Modern, clean design with balanced spacing */}
          <div
            className={`absolute left-1/2 top-1/2 z-20 flex ${
              isLargeNumber ? "h-14 px-3" : "h-14 w-14"
            } -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-0.5 rounded-full bg-gradient-to-r from-yellow to-orange-500 text-white shadow-lg transition-all duration-500 group-hover:scale-110 ${
              isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <Plus className="-ml-0.5 h-3.5 w-3.5 flex-shrink-0 stroke-[2.5]" />
            <span className="text-xs font-semibold tracking-tight">
              {totalCount}
            </span>
          </div>

          {/* Perfect circular ripples - Adjusted sizes */}
          <div
            className={`pointer-events-none absolute left-1/2 top-1/2 ${
              isLargeNumber ? "h-16 w-20" : "h-14 w-14"
            } -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-yellow/50 ${
              isVisible ? "animate-perfect-ripple" : "opacity-0"
            }`}
          />

          <div
            className={`pointer-events-none absolute left-1/2 top-1/2 ${
              isLargeNumber ? "h-20 w-24" : "h-18 w-18"
            } -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange/30 ${
              isVisible ? "animate-perfect-ripple-delayed" : "opacity-0"
            }`}
          />
        </div>

        {/* Call-to-action section */}
        <div className="text-center">
          <p
            className={`text-xs text-gray-600 transition-all duration-500 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {label}
          </p>

          {/* CTA with wiggle arrow */}
          <div
            className={`flex items-center justify-center gap-1 text-sm font-semibold text-black transition-all duration-300 group-hover:text-yellow ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <span>View All</span>

            {/* Wiggle arrow animation */}
            <ArrowRight
              className={`h-4 w-4 transition-all duration-300 ${
                isVisible ? "animate-wiggle" : ""
              } ${"group-hover:translate-x-1"}`}
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ViewAllGridCard;
