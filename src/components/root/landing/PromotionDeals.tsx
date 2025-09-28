import { headers } from "next/headers";
import { convertToLabel } from "@/helpers";
import { FetchRidePromotionsResponse } from "@/types";
import { API } from "@/utils/API";
import PromotionGrid from "@/components/card/vehicle-card/PromotionGrid";

export const revalidate = 3600; // 1 hour - longer cache

type PromotionDealsProps = {
  state: string | undefined;
  country: string | undefined;
};

export default async function PromotionDeals({
  state,
  country,
}: PromotionDealsProps) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
  const formattedState = convertToLabel(state);

  // Render shell immediately, load data in background
  return (
    <section className="no-global-padding relative mb-5 h-auto overflow-hidden py-10">
      {/* Instant CSS background */}
      <div
        className="absolute inset-0 scale-110"
        style={{
          background: isMobile
            ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
            : "#1a1a1a",
        }}
      />

      <div className="relative z-10">
        <div className="my-8 flex w-full flex-col gap-y-3 text-center">
          <h2 className="heading-primary !text-white">
            Best offers in {formattedState}
          </h2>
          <p className="text-[0.75rem] font-normal leading-[1] text-text-muted sm:text-[0.875rem] lg:text-base">
            Discover exclusive deals and discounts
          </p>
        </div>

        {/* Client component handles data loading */}
        <PromotionGrid state={state} country={country} />
      </div>
    </section>
  );
}
