import { ENV } from "@/config/env";

type BrandImageProps = {
  isClient?: boolean;
  category: string;
  brandValue: string;
  className: string;
};

export default function BrandImage({
  isClient = false,
  category,
  brandValue,
  className,
}: BrandImageProps) {
  const baseAssetsUrl = isClient ? ENV.NEXT_PUBLIC_API_URL : ENV.ASSETS_URL;
  return (
    <img
      src={`${baseAssetsUrl}/icons/brands/${category}/${brandValue}.png`}
      alt={brandValue}
      className={className}
    />
  );
}
