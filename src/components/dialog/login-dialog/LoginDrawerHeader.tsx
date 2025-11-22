import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Assuming shadcn-ui Button
import { X } from "lucide-react"; // Assuming lucide-react for icons

export const AdBanner = ({ handleClose }: { handleClose: () => void }) => {
  const [bannerData, setBannerData] = useState({
    id: "banner-homepage-promo-1",
    background: {
      type: "gradient",
      startColor: "#f9a825",
      endColor: "#f57f17",
      direction: "255.26deg",
    },
    logo: {
      src: "/assets/logo/Logo_Black.svg",
      alt: "Ride.Rent Logo",
    },
    mainImage: {
      src: "/assets/logo/banner-image.webp",
      alt: "Promotional Banner Image",
    },
    cta: {
      text: "Learn More",
      url: "/promotions/detail",
      variant: "primary",
    },
    isVisible: true,
    priority: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchBannerData = async () => {
  //     try {
  //       const response = await fetch("/api/banner"); // Your API endpoint
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       setBannerData(data);
  //     } catch (e) {
  //       setError(e);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchBannerData();
  // }, []);

  // if (loading) {
  //   return <div>Loading banner...</div>; // Or a skeleton loader
  // }

  // if (error) {
  //   console.error("Failed to load banner:", error);
  //   return null; // Don't render banner if there's an error
  // }

  // if (!bannerData || !bannerData.isVisible) {
  //   return null; // Don't render if no data or not visible
  // }

  // Destructure for easier access
  const { background, logo, mainImage } = bannerData;

  const backgroundStyle =
    background.type === "gradient"
      ? {
          background: `linear-gradient(${background.direction}, ${background.startColor} 29.45%, ${background.endColor} 88.69%)`,
        }
      : {}; // Extend for solid colors or image backgrounds if needed

  return (
    <div className="add-banner-wrapper relative">
      {mainImage ? (
        <div className="image-wrapper-test relative">
          <img src={mainImage.src} alt={mainImage.alt} />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute right-0 top-4"
            aria-label="Close login drawer"
          >
            <X
              className="h-5 w-5"
              aria-hidden="true"
              style={{ color: "white" }}
            />
          </Button>
        </div>
      ) : (
        <div className="p-6 text-white" style={backgroundStyle}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo.src} alt={logo.alt} className="w-[135px]" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Close login drawer"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
