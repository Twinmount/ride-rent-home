import VehicleRating from './VehicleRating';

type Props = {
  vehicleTitle: string;
  rating: string | undefined;
  layoutType: 'grid' | 'carousel';
};
export default function CardTitle({ vehicleTitle, rating, layoutType }: Props) {
  const fontSize = layoutType === 'carousel' ? 'text-sm lg:text-sm' : 'text-xs';
  return (
    <div className="flex-between text- flex gap-x-2">
      <h3 className={`line-clamp-1 font-medium ${fontSize}`}>{vehicleTitle}</h3>

      {/* <VehicleRating rating={rating} /> */}
    </div>
  );
}
