import "./Promotions.scss";
import PromotionCard from "@/components/card/vehicle-card/promotion-card/PromotionCard";
import CarouselWrapper from "@/components/common/carousel-wrapper/CarouselWrapper";
import MotionSection from "@/components/general/framer-motion/MotionSection";
import { FetchPromotionsResponse } from "@/types";

export default async function Recommended({
  state,
}: {
  state: string | undefined;
}) {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  // Fetch the vehicle data from the API
  const response = await fetch(
    `${baseUrl}/promotions/list?stateValue=${state}`,
    {
      next: { revalidate: 300 },
    }
  );
  const data: FetchPromotionsResponse = await response.json();

  const promotions = data.result.list || [];

  if (promotions.length === 0) {
    return null;
  }

  return (
    <MotionSection className="promotion-section wrapper">
      <h2>Recommended Car Rental deals</h2>

      <CarouselWrapper isButtonVisible={true}>
        {promotions.map((promotion) => (
          <PromotionCard key={promotion.promotionId} {...promotion} />
        ))}
      </CarouselWrapper>
    </MotionSection>
  );
}
