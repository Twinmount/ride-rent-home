import Image from 'next/image';
import Link from 'next/link';
import { StateType } from '@/types';

type StateCardProps = {
  state: StateType;
  category: string;
  country: string;
  index?: number;
};

export default function StateCard({
  state,
  category,
  country,
  index = 0,
}: StateCardProps) {
  return (
    <Link
      href={`/${country}/${state.stateValue}/${category}`}
      key={state.stateId}
      className="group relative flex h-[7.5rem] w-[6.25rem] cursor-pointer flex-col items-center justify-end overflow-hidden rounded-[0.75rem] bg-white transition-all duration-300 ease-out md:h-[8.75rem] md:w-[8.125rem] lg:h-[10rem] lg:w-[8.75rem]"
      style={{ boxShadow: "0rem 0rem 0.25rem 0rem #00000040" }}
      target="_blank"
    >
      {/* ✅ Simple optimized image - no GPU tricks */}
      <Image
        fill
        src={state.stateImage}
        alt={`${state.stateName} location`}
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        loading={index < 4 ? "eager" : "lazy"}
        priority={index < 2}
        quality={70} // ✅ Good balance for small cards
        sizes="(max-width: 640px) 100px, (max-width: 768px) 125px, (max-width: 1024px) 130px, 140px"
      />

      {/* ✅ Simple gradient - no GPU acceleration */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-full w-full"
        style={{
          background:
            "linear-gradient(180deg, transparent 53.75%, rgba(255, 255, 255, 0.8) 84.5%)",
        }}
      />

      {/* ✅ Simple caption */}
      <figcaption className="z-1 relative mb-[0.5rem] px-[0.5rem] text-center">
        <span className="text-xs font-normal leading-tight text-gray-800 drop-shadow-sm md:text-sm md:leading-[100%]">
          {state.stateName}
        </span>
      </figcaption>
    </Link>
  );
}
