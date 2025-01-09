import MotionSection from "@/components/general/framer-motion/MotionSection";
import CarouselWrapper from "@/components/common/carousel-wrapper/CarouselWrapper";
import ViewAllButton from "@/components/common/ViewAllButton";
import { BrandType, FetchTopBrandsResponse } from "@/types";
import Link from "next/link";
import { convertToLabel } from "@/helpers";
import Image from "next/image";

export const revalidate = 3600;

export default async function TopBrands({
  category,
  state,
}: {
  category: string | undefined;
  state: string | undefined;
}) {
  const baseUrl = process.env.API_URL;

  const url = `${baseUrl}/vehicle-brand/top-brands?categoryValue=${category}`;

  // Fetch brand data from your API endpoint
  const response = await fetch(url);

  // Parse the JSON response
  const data: FetchTopBrandsResponse = await response.json();

  // Extract the list of brands from the response
  const brands = data?.result || [];

  if (brands.length === 0) return null;

  return (
    <MotionSection className="section-container wrapper">
      <h2 className="section-heading">
        Rent from top brands in{" "}
        <span className="yellow-gradient rounded-xl px-2 capitalize">
          {convertToLabel(state as string)}
        </span>
      </h2>

      <CarouselWrapper>
        {brands.map((brand: BrandType) => (
          <BrandCard
            key={brand.id}
            brand={brand}
            category={category!}
            state={state!}
          />
        ))}
      </CarouselWrapper>

      <ViewAllButton link={`/${state}/${category}/brands`} />
    </MotionSection>
  );
}

// Render a single brand card
export function BrandCard({
  brand,
  category,
  state,
}: {
  brand: BrandType;
  category: string;
  state: string;
}) {
  const baseAssetsUrl = process.env.ASSETS_URL;

  return (
    <Link
      href={`/${state}/listing?brand=${brand.brandValue}&category=${category}`}
      key={brand.id}
      className="flex aspect-square h-[8rem] max-h-[8rem] min-h-[8rem] w-[8rem] min-w-[8rem] max-w-[8rem] cursor-pointer flex-col items-center justify-between rounded-[1rem] border border-black/10 bg-white p-2 shadow-[0px_2px_2px_rgba(0,0,0,0.2)] transition-transform duration-200 ease-out hover:scale-105 hover:shadow-[0px_2px_2px_rgba(0,0,0,0.5)]"
    >
      <div className="relative m-auto flex h-[6rem] min-h-[6rem] w-full min-w-full items-center justify-center">
        <Image
          src={`${baseAssetsUrl}/icons/brands/${category}/${brand.brandValue}.png`}
          width={80}
          height={80}
          alt={brand.brandName}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="line-clamp-1 flex h-[20%] w-[95%] max-w-[95%] items-center justify-center truncate text-[0.9rem] text-[#181818]">
        {brand.brandName}
      </div>
    </Link>
  );
}
