import PromotionCard from '@/components/card/vehicle-card/PromotionCard';
import { convertToLabel } from '@/helpers';
import { FetchRidePromotionsResponse } from '@/types';
import { API } from '@/utils/API';

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
    path: `/ride-promotions/public?stateValue=${state}`,
    options: {
      method: 'GET',
      cache: 'no-cache',
    },
    country,
  });
  const data: FetchRidePromotionsResponse = await response.json();

  const promotionData = data.result || null;
  const promotions = promotionData?.cards || [];

  if (!promotionData || promotions.length === 0) {
    return null;
  }

  const formattedState = convertToLabel(state);

  return (
    <section className="no-global-padding relative mb-5 h-auto overflow-hidden py-10">
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
          <h2 className="heading-primary !text-white">
            {promotionData.sectionTitle || `Best offers in ${formattedState}`}
          </h2>

          <p className="text-[0.75rem] font-normal leading-[1] text-text-muted sm:text-[0.875rem] lg:text-base">
            {promotionData.sectionSubtitle}
          </p>
        </div>

        <div className={`flex-center mx-auto w-full flex-wrap gap-6`}>
          {promotions.map((promotion) => (
            <PromotionCard key={promotion._id} {...promotion} />
          ))}
        </div>
      </div>
    </section>
  );
}
