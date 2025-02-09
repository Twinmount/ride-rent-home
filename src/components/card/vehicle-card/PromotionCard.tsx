import { PromotionType } from "@/types";
import Link from "next/link";

const PromotionCard = ({ promotionImage, promotionLink }: PromotionType) => {
  return (
    <Link href={promotionLink} target="_blank" rel="noopener noreferrer">
      <div className="group relative h-[21rem] max-h-[21rem] w-full min-w-[15rem] max-w-[17rem] cursor-pointer overflow-hidden rounded-xl bg-white shadow-md">
        <figure className="relative flex h-full w-full items-center justify-center">
          <img
            src={promotionImage}
            alt="Promotion"
            className="h-full w-full transform object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
            <span className="text-lg font-semibold text-white">Visit</span>
          </div>
        </figure>
      </div>
    </Link>
  );
};

export default PromotionCard;
