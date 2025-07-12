import PromotionCard from "@/components/card/vehicle-card/PromotionCard";
import { convertToLabel } from "@/helpers";
import { FetchPromotionsResponse } from "@/types";
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

  // bg image is available at "/assets/img/bg/promotion-bg.png"

  return (
    <section className="section-container relative overflow-hidden py-10">
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
        </div>

        <div
          className={`mx-auto grid gap-6 ${
            promotions.length < 4
              ? `grid-cols-${promotions.length}`
              : "grid-cols-4"
          } sm:grid-cols-2 lg:grid-cols-4`}
        >
          {promotions.map((promotion) => (
            <PromotionCard key={promotion.promotionId} {...promotion} />
          ))}
        </div>
      </div>
    </section>
  );
}
