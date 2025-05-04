import { ENV } from "@/config/env";

type BrandImageProps = {
  category: string;
  brandValue: string;
  className: string;
};

export default function BrandImage({
  category,
  brandValue,
  className,
}: BrandImageProps) {
  const baseAssetsUrl = ENV.ASSETS_URL || ENV.NEXT_PUBLIC_ASSETS_URL;
  console.log("BrandImage", baseAssetsUrl);
  return (
    <img
      src={`${baseAssetsUrl}/icons/brands/${category}/${brandValue}.png`}
      alt={brandValue}
      className={className}
    />
  );
}
