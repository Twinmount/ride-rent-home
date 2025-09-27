import SafeImage from "@/components/common/SafeImage";

import { ENV } from "@/config/env";

type BrandImageProps = {
  category: string;
  brandValue: string;
  className: string;
  priority?: boolean;
  sizes?: string;
};

const BrandImage = ({
  category,
  brandValue,
  className,
  priority = false,
  sizes = "72px",
}: BrandImageProps) => {
  const baseAssetsUrl = ENV.ASSETS_URL || ENV.NEXT_PUBLIC_ASSETS_URL;
  const imageSrc = `${baseAssetsUrl}/icons/brands/${category}/${brandValue}.png`;

  return (
    <SafeImage
      src={imageSrc}
      alt={`${brandValue} brand logo`}
      fill
      className={className}
      priority={priority}
      sizes={sizes}
      quality={90}
    />
  );
};

export default BrandImage;
