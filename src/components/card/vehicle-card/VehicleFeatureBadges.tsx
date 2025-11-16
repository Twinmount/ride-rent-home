import { Badge } from "@/components/ui/badge";

type VehicleFeatureBadgesProps = {
  hasPayOnPickup: boolean;
  hasNoDeposit: boolean;
};

export default function VehicleFeatureBadges({
  hasPayOnPickup,
  hasNoDeposit,
}: VehicleFeatureBadgesProps) {
  if (!hasPayOnPickup && !hasNoDeposit) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {hasPayOnPickup && (
        <Badge
          variant="secondary"
          className="border bg-gray-200 px-2 py-0.5 text-[10px]"
        >
          Pay on Pickup
        </Badge>
      )}
      {hasNoDeposit && (
        <Badge
          variant="secondary"
          className="border bg-gray-200 px-2 py-0.5 text-[10px]"
        >
          No Deposit
        </Badge>
      )}
    </div>
  );
}
