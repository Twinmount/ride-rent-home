"use client";

import { useState, useEffect } from "react";
import PromotionCard from "@/components/card/vehicle-card/PromotionCard";
import { FetchRidePromotionsResponse } from "@/types";
import { API } from "@/utils/API";

type PromotionGridProps = {
  state: string | undefined;
  country: string | undefined;
};

export default function PromotionGrid({ state, country }: PromotionGridProps) {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data after initial render
    const loadPromotions = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000); // 1s timeout

        const response = await API({
          path: `/ride-promotions/public?stateValue=${state}`,
          options: {
            method: "GET",
            cache: "force-cache",
            signal: controller.signal
          },
          country,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data: FetchRidePromotionsResponse = await response.json();
          const cards = data.result?.cards || [];
          setPromotions(cards.slice(0, 6)); // Limit to 6 cards
        }
      } catch (error) {
        // Fail silently
      } finally {
        setLoading(false);
      }
    };

    // Load after a short delay to prioritize page render
    const timer = setTimeout(loadPromotions, 100);
    return () => clearTimeout(timer);
  }, [state, country]);

  if (loading) {
    return (
      <div className="flex-center mx-auto w-full flex-wrap gap-6">
        {/* Instant skeleton cards */}
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="h-[7.5rem] w-[10.34rem] md:h-[14rem] md:w-[16rem] lg:h-[16rem] lg:w-[18.5rem] rounded-[0.5rem] bg-white/10 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/60">No promotions available</p>
      </div>
    );
  }

  return (
    <div className="flex-center mx-auto w-full flex-wrap gap-6">
      {promotions.map((promotion) => (
        <PromotionCard key={promotion._id} {...promotion} />
      ))}
    </div>
  );
}
