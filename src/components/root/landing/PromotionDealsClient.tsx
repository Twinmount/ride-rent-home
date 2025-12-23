"use client";

import PromotionCard from "@/components/card/vehicle-card/PromotionCard";
import { convertToLabel } from "@/helpers";
import { fetchPromotionDeals } from "@/lib/api/general-api";
import PromotionSkeleton from "@/components/skelton/PromotionSkeleton";
import { useQuery } from "@tanstack/react-query";

type PromotionDealsProps = {
  state: string | undefined;
  country: string | undefined;
};

/**
 * Client component equivalent to SSR-PromotionDeals
 */
export default function PromotionDealsClient({
  state,
  country,
}: PromotionDealsProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["promotions", state, country],
    queryFn: () => fetchPromotionDeals(state, country),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!state && !!country,
  });

  if (isLoading) {
    return <PromotionSkeleton />;
  }

  if (error) {
    return null;
  }

  const promotionData = data?.result || null;
  const promotions = promotionData?.cards || [];

  if (!promotionData || promotions.length === 0) {
    return null;
  }

  const formattedState = convertToLabel(state);

  return (
    <section className="no-global-padding relative mb-5 h-auto overflow-hidden py-10">
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/img/bg/promotion-bg.webp')",
          backgroundColor: "#1a1a1a",
        }}
      />

      <div className="relative z-10 max-w-full overflow-hidden">
        <div className="my-8 flex w-full flex-col gap-y-3 px-4 text-center">
          <h2 className="heading-primary !text-white">
            {promotionData.sectionTitle || `Best offers in ${formattedState}`}
          </h2>
          <p className="text-xs font-normal leading-none text-text-muted sm:text-sm lg:text-base">
            {promotionData.sectionSubtitle}
          </p>
        </div>

        <div className="flex-center *: w-full max-w-full flex-wrap gap-2 md:gap-6">
          {promotions.map((promotion) => (
            <PromotionCard key={promotion._id} {...promotion} />
          ))}
        </div>
      </div>
    </section>
  );
}
