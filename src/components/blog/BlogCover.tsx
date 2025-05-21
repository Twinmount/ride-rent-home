import Image from "next/image";

interface BlogCoverProps {
  children: React.ReactNode;
  thumbnail: string;
}

export default function BlogCover({ children, thumbnail }: BlogCoverProps) {
  return (
    <div
      className={`relative max !h-[50vh] max-sm:min-h-[280px] max-sm:!h-[35vh] sm:min-h-[350px] !max-h-[50vh] bg-[auto_105%] bg-[center_bottom] bg-no-repeat`}
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
      <div className="absolute inset-0 bg-black opacity-60 z-10" />

      {/* Children content above overlay */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
