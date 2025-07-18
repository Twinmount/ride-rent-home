import { StateType } from "@/types";
import Image from "next/image";

type Props = {
  state: StateType;
  handleStateSelect: (state: string) => void;
};
export default function LocationDialogStateCard({
  state,
  handleStateSelect,
}: Props) {
  return (
    <li
      key={state.stateId}
      className="group relative flex h-[7.5rem] w-[6.25rem] cursor-pointer flex-col items-center justify-end overflow-hidden rounded-[0.75rem] bg-white transition-all duration-300 ease-out lg:h-[9rem] lg:w-[8.4375rem]"
      style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
      onClick={() => handleStateSelect(state?.stateValue)}
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
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0) 53.75%, rgba(255, 255, 255, 0.8) 84.5%)",
        }}
      />

      {/* State name with enhanced styling */}
      <figcaption className="z-1 relative mb-3 px-2 text-center">
        <span className="text-base font-medium text-gray-800 drop-shadow-sm">
          {state.stateName}
        </span>
      </figcaption>
    </li>
  );
}
