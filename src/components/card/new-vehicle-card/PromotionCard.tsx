import { PromotionType } from "@/types";
import Image from "next/image";
import Link from "next/link";

const PromotionCard = ({
  promotionImage,
  promotionLink,
  title,
  description,
}: PromotionType) => {
  return (
    <Link href={promotionLink} target="_blank" rel="noopener noreferrer">
      <div className="group relative h-[15rem] w-full min-w-[15rem] max-w-[17rem] cursor-pointer overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
        {/* Background Image */}
        <Image src={promotionImage} alt={title} fill className="object-cover" />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        {/* Text Content */}
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="mt-1 text-sm text-gray-200">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default PromotionCard;
