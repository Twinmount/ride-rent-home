import Image from 'next/image';
import Link from 'next/link';
import { StateType } from '@/types';

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
    // Card link with responsive dimensions and hover effects
    <Link
      href={`/${country}/${state.stateValue}/${category}`}
      key={state.stateId}
      className="group relative flex h-[7.5rem] w-[6.25rem] cursor-pointer flex-col items-center justify-end overflow-hidden rounded-[0.75rem] bg-white transition-all duration-300 ease-out md:h-[8.75rem] md:w-[8.125rem] lg:h-[10rem] lg:w-[8.75rem]"
      style={{ boxShadow: '0rem 0rem 0.25rem 0rem #00000040' }}
      target="_blank"
    >
      {/* Background state image with hover scale effect */}
      <Image
        fill
        src={state.stateImage}
        alt={`${state.stateName} logo`}
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />

      {/* White gradient overlay for text readability */}
      <div
        className="absolute bottom-0 left-0 h-full w-full"
        style={{
          background:
            'linear-gradient(180deg, rgba(0, 0, 0, 0) 53.75%, rgba(255, 255, 255, 0.8) 84.5%)',
        }}
      />

      {/* State name caption with responsive typography */}
      <figcaption className="z-1 relative mb-[0.5rem] px-[0.5rem] text-center">
        <span className="text-[0.875rem] font-medium text-gray-800 drop-shadow-sm md:text-[1rem]">
          {state.stateName}
        </span>
      </figcaption>
    </Link>
  );
}
