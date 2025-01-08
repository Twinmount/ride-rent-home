"use client";

import { useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/next-api/next-api";
import { sortCategories } from "@/helpers";
import { CategoryType } from "@/types/contextTypes";
import Link from "next/link";
import Image from "next/image";
import VehicleCategorySkelton from "@/components/skelton/VehicleCategorySkelton";
import { useParams } from "next/navigation";
import { MotionDivElm } from "@/components/general/framer-motion/MotionElm";

export default function VehicleCategories() {
  // const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  // Fetch categories using useQuery
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Check if data is defined and then sort categories
  const sortedCategories = useMemo(() => {
    return data?.result?.list ? sortCategories(data.result.list) : [];
  }, [data]);

  if (isLoading) return <VehicleCategorySkelton />;

  return (
    <div
      className="mx-auto mr-2 h-fit w-[86%] rounded-xl py-0 max-lg:mr-10 max-md:mr-5 sm:w-[70%] sm:max-w-[70%] md:ml-6 lg:max-w-[75%]"
      id="categories"
    >
      <Carousel className="w-full p-0">
        <CarouselContent className="flex h-fit gap-x-2 px-1 py-0 md:gap-x-3 lg:gap-x-4">
          {sortedCategories.map((cat: CategoryType, index) => (
            <VehicleCategoryCard key={cat.categoryId} cat={cat} index={index} />
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

function VehicleCategoryCard({
  cat,
  index,
}: {
  cat: CategoryType;
  index: number;
}) {
  const params = useParams<{ state: string; category: string }>();

  const state = params.state || "dubai";
  const category = params.category || "cars";

  const baseAssetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL;

  // Animation variants for categories
  const categoryVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <MotionDivElm
      key={cat.categoryId}
      custom={index} // Pass the index for staggered animation
      initial="hidden"
      animate="visible"
      variants={categoryVariants}
      className="h-full"
    >
      <Link
        href={`/${state}/${cat.value}`}
        key={cat.categoryId}
        className={`flex aspect-square h-[70%] w-[4rem] min-w-[4rem] cursor-pointer flex-col justify-center gap-[0.2rem] overflow-hidden rounded-[0.4rem] lg:w-[5.2rem] lg:min-w-[5.2rem]`}
      >
        <div
          className={`flex h-[60%] w-full items-center justify-center rounded-[0.4rem] bg-gray-100 ${
            category === cat.value ? "yellow-gradient" : ""
          }`}
        >
          <Image
            src={`${baseAssetsUrl}/icons/vehicle-categories/${cat.value}.png`}
            alt={`${cat.name} Icon`}
            className={`transition-all duration-200 ease-out ${
              cat.value === "sports-cars" ? "scale-[1.02]" : ""
            }`}
            width={40}
            height={40}
          />
        </div>
        <span
          className={`line-clamp-1 w-full text-center text-[0.56rem] text-gray-600 lg:text-[0.65rem] ${
            category === cat.value && "font-medium"
          }`}
        >
          {cat.name}
        </span>
      </Link>
    </MotionDivElm>
  );
}

<div className="mx-auto grid w-fit grid-cols-2 place-items-center gap-2 py-4 md:grid-cols-3"></div>;
