import Image from "next/image";

interface BlogCoverProps {
  children: React.ReactNode;
  thumbnail: string;
}

export default function BlogCover({ children, thumbnail }: BlogCoverProps) {
  return (
    <div
      className={`max relative !h-[50vh] !max-h-[50vh] bg-[auto_105%] bg-[center_bottom] bg-no-repeat max-sm:!h-[35vh] max-sm:min-h-[280px] sm:min-h-[350px]`}
    >
      <Image
        src={thumbnail ?? "/assets/bg/blur.jpg"}
        alt="Picture of the author"
        fill
        className="object-cover"
        quality={100}
        priority={true}
        placeholder="blur"
        blurDataURL="/assets/bg/blur.jpg"
        sizes="100vw"
      />

      {/* Black overlay */}
      <div className="absolute inset-0 z-10 bg-black opacity-60" />

      {/* Children content above overlay */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
