import HoverOverlay from "@/components/common/HoverOverlay";
import Image from "next/image";
import Link from "next/link";

type PropType = {
  promotionImage: string;
  promotionLink: string;
};

export default function PromotionSideCard({
  promotionImage,
  promotionLink,
}: PropType) {
  return (
    <Link
      href={promotionLink}
      target="_blank"
      className="group relative mb-1 flex h-28 w-full items-center gap-2 overflow-hidden rounded-xl border-b border-gray-200 p-0 transition duration-200 hover:bg-gray-100"
    >
      {/* Blog Image */}
      <Image
        fill={true}
        src={promotionImage}
        alt={"Promotion"}
        className="h-full w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <HoverOverlay label="View" />
    </Link>
  );
}
