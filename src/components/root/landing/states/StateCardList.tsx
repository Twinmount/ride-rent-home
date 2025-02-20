import Image from "next/image";
import Link from "next/link";
import { StateType } from "@/types";

type StateCardListProps = {
  states: StateType[];
  category: string;
};

export default function StateCardList({
  states,
  category,
}: StateCardListProps) {
  if (!states.length) return null;

  return states.map((state) =>
    state.stateImage ? (
      <Link
        href={`/${state.stateValue}/${category}`}
        key={state.stateId}
        className="group relative flex h-[7rem] w-full min-w-[10rem] max-w-[12rem] cursor-pointer items-center justify-center overflow-hidden rounded-[2rem] text-center shadow-[2px_2px_4px_rgba(0,0,0,0.5)] transition-all duration-700 ease-in"
        target="_blank"
      >
        <div className="absolute bottom-0 left-0 h-1/4 w-full bg-gradient-to-t from-black/80 to-transparent" />

        <Image
          fill
          src={state.stateImage}
          alt={`${state.stateName} logo`}
          className="h-full w-full scale-110 object-cover transition-transform duration-500 ease-out group-hover:scale-100"
        />
        <figcaption className="absolute bottom-[0.2rem] z-[2] m-0 whitespace-nowrap p-0 font-bold text-white">
          {state.stateName}
        </figcaption>
      </Link>
    ) : null,
  );
}
