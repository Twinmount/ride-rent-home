import { VehicleDetailsImageSkeleton } from "@/components/skelton/VehicleDetailsImageSkeleton";
import Image from "next/image";
import { useState } from "react";

export default function VehicleImage({
  src,
  index,
}: {
  src: string;
  index: number;
}) {
  const [isImageLoading, setImageLoading] = useState(true);

  return (
    <div className="relative h-full min-h-full w-full min-w-full">
      {/* Show skeleton only when image is loading */}
      {isImageLoading && <VehicleDetailsImageSkeleton />}

      <Image
        src={src}
        alt={`Vehicle image ${index + 1}`}
        className="h-full w-full rounded-[1rem] object-contain"
        fill
        onLoad={() => setImageLoading(false)}
      />
    </div>
  );
}
