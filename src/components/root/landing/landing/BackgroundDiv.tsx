import Image from "next/image";

interface CustomDivProps {
  children: React.ReactNode;
  category: string;
}

export default function BackgroundDiv({ children, category }: CustomDivProps) {
  const baseAssetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL;

  return (
    <div className={`landing-bg `}>
      <Image
        src={`${baseAssetsUrl}/img/bg/${category}.webp`}
        alt={`${category} banner`}
        fill
        quality={100}
        priority={true}
        placeholder="blur"
        blurDataURL="/assets/img/bg/blur.jpg"
        sizes="100vw"
      />
      {children}
    </div>
  );
}
