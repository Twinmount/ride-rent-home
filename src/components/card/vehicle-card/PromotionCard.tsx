import { RidePromotionCard } from "@/types";
import Link from "next/link";

const PromotionCard = ({
  image,
  link,
  cardTitle,
  cardSubtitle,
}: RidePromotionCard) => {
  return (
    <Link href={link} target="_blank" rel="noopener noreferrer">
      <div className="group relative h-[7.5rem] w-[10.34rem] cursor-pointer overflow-hidden rounded-[0.5rem] shadow-lg transition-transform duration-300 hover:scale-105 md:h-[14rem] md:w-[16rem] lg:h-[16rem] lg:w-[18.5rem]">
        {/* ⚡ Optimized image loading */}
        <img
          src={image}
          alt={cardTitle}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          width="296"
          height="256"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4 text-center">
          <h3 className="text-xs font-semibold text-white md:text-base lg:text-xl">
            {cardTitle}
          </h3>
          <p className="mt-1 text-[0.5rem] text-gray-200 lg:text-xs">
            {cardSubtitle}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PromotionCard;
