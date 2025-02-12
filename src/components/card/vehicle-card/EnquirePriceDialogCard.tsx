import { VehicleCardType } from "@/types/vehicle-types";

import VehicleThumbnail from "./VehicleThumbnail";
import CompanyLogo from "./CompanyLogo";
import { Button } from "@/components/ui/button";

type EnquirePriceDialogCardProps = {
  vehicle: VehicleCardType;
};
export default function EnquirePriceDialogCard({
  vehicle,
}: EnquirePriceDialogCardProps) {
  return (
    <div className="flex-center flex-col gap-y-2 rounded-2xl border p-4">
      <div className="relative h-40 w-full rounded-2xl">
        <VehicleThumbnail
          src={vehicle?.thumbnail}
          alt={vehicle?.model || "Vehicle Image"}
          width={400}
          height={400}
          className="h-full w-full rounded-2xl object-cover"
        />
        <CompanyLogo
          src={vehicle?.companyLogo}
          width={40}
          height={40}
          className="absolute bottom-[-1.2rem] right-4 aspect-square h-10 w-10 rounded-full border border-gray-200 bg-white object-cover p-[0.1rem]"
        />
        <span className="absolute left-2 top-2 z-20 rounded-md bg-white px-[0.3rem] py-[0.3rem] text-[0.8rem] text-gray-500 shadow-sm">
          {vehicle?.brandName}
        </span>
      </div>

      <h3 className="my-2 line-clamp-1 w-full max-w-full text-lg font-semibold">
        {vehicle?.model}
      </h3>

      <form className="flex-center w-full flex-col gap-y-2">
        <label className="text-center text-lg">Mention your trip days</label>
        <input
          type="text"
          placeholder="Enter days"
          required
          className="bg-grey-50 placeholder:text-grey-500 p-regular-16 h-[44px] w-full max-w-96 rounded-xl border border-gray-500 px-4 py-3 placeholder:italic focus:outline-none focus-visible:ring-transparent focus-visible:ring-offset-0"
        />
        <Button
          type="submit"
          className="yellow-gradient flex-center w-full rounded-xl py-1 text-black"
        >
          Start the chat
        </Button>
      </form>
    </div>
  );
}
