import { CheckCircle } from "lucide-react";

type PayOnPickupProps = {
  hasPayOnPickup: boolean;
};

const PayOnPickup = ({ hasPayOnPickup = false }: PayOnPickupProps) => {
  if (!hasPayOnPickup) return null;

  return (
    <div
      className={`mx-4 flex items-center justify-center text-sm text-gray-500`}
    >
      <CheckCircle className={`h-4 w-4 flex-shrink-0`} />

      <span className={`ml-1 whitespace-nowrap text-xs font-normal capitalize`}>
        Pay only on Pickup
      </span>
    </div>
  );
};

export default PayOnPickup;
