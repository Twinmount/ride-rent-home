import SafeImage from "@/components/common/SafeImage";
import Link from "next/link";
import { StateType } from "@/types";

type StateCardProps = {
  state: StateType;
  category: string;
  country: string;
};

export default function StateCard({
  state,
  category,
  country,
}: StateCardProps) {
  return (
    <Link
      href={`/${country}/${state.stateValue}/${category}`}
      className="group relative flex h-32 w-24 cursor-pointer flex-col items-center justify-end overflow-hidden rounded-xl bg-white shadow-md md:h-36 md:w-32 lg:h-40 lg:w-36"
    >
      <SafeImage
        fill
        src={state.stateImage}
        alt={`${state.stateName} location`}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
        quality={60}
        sizes="(max-width: 768px) 96px, (max-width: 1024px) 128px, 144px"
      />

      {/* Simple gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />

      {/* State name */}
      <div className="relative z-10 mb-2 px-2 text-center">
        <span className="text-xs font-medium text-gray-800 md:text-sm">
          {state.stateName}
        </span>
      </div>
    </Link>
  );
}
