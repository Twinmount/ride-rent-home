import { FC } from "react";
import { Star } from "lucide-react";

interface VehicleRatingProps {
  rating: string;
}

/**
 * A minimal component to display a rating with a star icon in the VehicleCard.
 * Example: 4.5 ★
 */
const VehicleRating: FC<VehicleRatingProps> = ({ rating }) => {
  return (
    <div className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm text-gray-700">
      <span>{rating || "3.2"}</span>
      <Star size={14} className="text-accent-light" fill="currentColor" />
    </div>
  );
};

export default VehicleRating;
