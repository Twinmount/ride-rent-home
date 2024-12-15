"use client";

import { Share2 } from "lucide-react";

export default function SharePortfolio() {
  const handleShare = () => {
    const currentUrl = window.location.href; // Get the current page URL

    if (navigator.share) {
      navigator
        .share({
          title: "Check out this agent portfolio from ride.rent", // Optionally add a title
          url: currentUrl, // Share the current page URL
        })
        .catch((error) => console.error("Error sharing", error));
    } else {
      alert("Share functionality is not supported in this browser.");
    }
  };

  return (
    <button onClick={handleShare} className="flex-center ">
      <Share2 className="text-yellow w-4 h-4  mr-1 mb-1 group hover:bg-gray-100" />
      <span className="group-hover:underline font-light">Share Portfolio</span>
    </button>
  );
}
