import Image from "next/image";

type VehicleThumbnailProps = {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

const VehicleThumbnail = ({
  src,
  alt,
  width,
  height,
  className,
}: VehicleThumbnailProps) => {
  return src ? (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  ) : (
    <img
      src={"/assets/img/default-thumbnail.webp"}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default VehicleThumbnail;
