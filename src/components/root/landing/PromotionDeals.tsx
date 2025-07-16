import PromotionCard from "@/components/card/vehicle-card/PromotionCard";
import { SectionHeading } from "@/components/common/SectionHeading";
import { convertToLabel } from "@/helpers";
import { FetchPromotionsResponse, PromotionType } from "@/types";
import { API } from "@/utils/API";

export const revalidate = 900;

type PromotionDealsProps = {
  state: string | undefined;
  country: string | undefined;
};

export default async function PromotionDeals({
  state,
  country,
}: PromotionDealsProps) {
  const response = await API({
    path: `/promotions/list?stateValue=${state}&page=1&limit=5&sortOrder=DESC`,
    options: {
      method: "GET",
      cache: "no-cache",
    },
    country,
  });
  const data: FetchPromotionsResponse = await response.json();

  const promotions = data.result.list || [];

  if (promotions.length === 0) {
    return null;
  }

  const formattedState = convertToLabel(state);

  const samplePromotions: PromotionType[] = [
    {
      promotionId: "1",
      promotionImage: "/assets/sample/promotion/promotion-1.png",
      promotionLink: "/ae/dubai/cars",
      title: "Offer Upto 25%",
      description: "Lorem ipsum dolor sit amet consectetur.",
    },
    {
      promotionId: "2",
      promotionImage: "/assets/sample/promotion/promotion-2.png",
      promotionLink: "/ae/dubai/cars",
      title: "Offer Upto 25%",
      description: "Lorem ipsum dolor sit amet consectetur.",
    },
    {
      promotionId: "3",
      promotionImage: "/assets/sample/promotion/promotion-1.png",
      promotionLink: "/ae/dubai/cars",
      title: "Offer Upto 25%",
      description: "Lorem ipsum dolor sit amet consectetur.",
    },
    {
      promotionId: "4",
      promotionImage: "/assets/sample/promotion/promotion-2.png",
      promotionLink: "/ae/dubai/cars",
      title: "Offer Upto 25%",
      description: "Lorem ipsum dolor sit amet consectetur.",
    },
  ];

  // bg image is available at "/assets/img/bg/promotion-bg.png"

  return (
    <section className="no-global-padding relative h-auto overflow-hidden py-10">
      {/* Background image */}
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center transition-transform duration-500"
        style={{
          backgroundImage: "url('/assets/img/bg/promotion-bg.png')",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="my-8 flex w-full flex-col gap-y-3 text-center">
          <h2 className="heading-primary !text-white">{`Best offers in ${formattedState}`}</h2>

          <p className="text-[0.75rem] font-normal leading-[1] text-text-muted sm:text-[0.875rem] lg:text-base">
            Lorem ipsum dolor sit amet consectetur. Semper fringilla ut aliquet
            aliquet sodales sagittis.
          </p>
        </div>

        <div className={`flex-center mx-auto w-full flex-wrap gap-6`}>
          {samplePromotions.map((promotion) => (
            <PromotionCard key={promotion.promotionId} {...promotion} />
          ))}
        </div>
      </div>
    </section>
  );
}
