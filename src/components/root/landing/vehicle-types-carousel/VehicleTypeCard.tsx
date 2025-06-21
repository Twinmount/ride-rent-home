import { MotionDivElm } from "@/components/general/framer-motion/MotionElm";
import Image from "next/image";
import { VehicleTypeType } from "@/types";
import { ENV } from "@/config/env";
import { easeOut } from "framer-motion";

export function VehicleTypeCard({
  type,
  category,
  index,
  handleTypeClick,
  currentType,
}: {
  type: VehicleTypeType;
  category: string;
  index: number;
  handleTypeClick: (typeValue: string) => void;
  currentType?: string | null;
}) {
  const baseAssetsUrl = ENV.NEXT_PUBLIC_ASSETS_URL;

  // Animation variants for categories
  const categoryVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.07,
        duration: 0.5,
        ease: easeOut,
      },
    }),
  };

  const isSelected = currentType === type.value;

  return (
    <MotionDivElm
      custom={index} // Pass index for delay
      initial="hidden"
      animate="visible"
      variants={categoryVariants}
      className="h-full"
    >
      <div
        onClick={() => handleTypeClick(type.value)}
        className={`group relative flex aspect-square h-[70%] w-[4rem] min-w-[4rem] cursor-pointer flex-col justify-center gap-[0.2rem] overflow-hidden rounded-[0.4rem] lg:w-[5.2rem] lg:min-w-[5.2rem]`}
      >
        <div
          className={`mx-auto flex h-[55%] w-[80%] items-center justify-center rounded-[0.4rem] bg-gray-100`}
        >
          <Image
            width={90}
            height={60}
            src={`${baseAssetsUrl}/icons/vehicle-types/${category}/${type.value}.webp`}
            alt={`${type.name} Icon`}
            className={`transition-all duration-200 ease-out`}
          />
        </div>
        <span
          className={`line-clamp-1 w-full text-center text-[0.56rem] font-normal text-gray-600 lg:text-[0.65rem] ${isSelected && "font-semibold text-black"}`}
        >
          {type.name}
        </span>

        <div
          className={`absolute bottom-0 left-1/2 h-[0.20rem] w-[85%] -translate-x-1/2 transform rounded-full ${isSelected ? "bg-yellow" : "bg-gray-300 opacity-0 group-hover:opacity-100"}`}
        />
      </div>
    </MotionDivElm>
  );
}
