import SafeImage from "@/components/common/SafeImage";
import { getAssetsUrl } from "@/utils/getCountryAssets";

type BrandImageProps = {
  category: string;
  brandValue: string;
  className: string;
  priority?: boolean;
  sizes?: string;
  country?: string;
};

const BrandImage = ({
  category,
  brandValue,
  className,
  priority = false,
  sizes = "72px",
  country,
}: BrandImageProps) => {
  const baseAssetsUrl = getAssetsUrl(country);
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
