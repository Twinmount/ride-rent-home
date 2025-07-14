import Image from "next/image";
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
      key={state.stateId}
      className="group relative flex h-[175px] w-[150px] m-2 cursor-pointer flex-col items-center justify-end overflow-hidden rounded-[1rem] transition-all duration-300 ease-out bg-white"
      style={{ boxShadow: '0px 0px 4px 0px #00000040' }}
      target="_blank"
    >
      {/* Background Image */}
      <Image
        fill
        src={state.stateImage}
        alt={`${state.stateName} logo`}
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      
      {/* White gradient to match design */}
      <div 
        className="absolute bottom-0 left-0 h-full w-full"
        style={{ 
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 53.75%, rgba(255, 255, 255, 0.8) 84.5%)' 
        }}
      />
      
      {/* State name with enhanced styling */}
      <figcaption className="relative z-1 mb-3 px-2 text-center">
        <span className="text-base font-medium text-gray-800 drop-shadow-sm">
          {state.stateName}
        </span>
      </figcaption>
    </Link>
  );
}