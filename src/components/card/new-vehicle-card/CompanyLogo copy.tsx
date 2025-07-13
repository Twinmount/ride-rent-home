import Image from "next/image";

type CompanyLogoProps = {
  src: string | null;
  alt?: string;
  width: number;
  height: number;
  className?: string;
};

const CompanyLogo = ({
  src,
  alt = "Company Logo",
  width,
  height,
  className,
}: CompanyLogoProps) => {
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
      src={"/assets/img/blur-profile.webp"} // Fallback for missing logos
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default CompanyLogo;
