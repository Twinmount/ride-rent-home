"use client";
import { List, Map } from "lucide-react";

type MapToggleButtonProps = {
  showMap: boolean;
  toggleMap: () => void;
};

export default function MapToggleButton({
  showMap,
  toggleMap,
}: MapToggleButtonProps) {
  return (
    <div className="sticky bottom-[10%] z-50 mt-auto flex justify-center lg:hidden">
      <button
        className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-gray-800"
        onClick={toggleMap}
      >
        {!showMap ? (
          <>
            Show map
            <Map size={16} className="text-white" />
          </>
        ) : (
          <>
            Show list
            <List size={16} className="text-white" />
          </>
        )}
      </button>
    </div>
  );
}
