import { CiLocationOn } from "react-icons/ci";

type VehicleStatsProps = {
  state: string;
};

const VehicleStats = ({ state }: VehicleStatsProps) => {
  // Capitalize the first letter of each word in the state
  const capitalizedState = state
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return (
    <div className="flex items-center p-1 text-sm font-light text-text-secondary">
      <p className="mr-1">
        <CiLocationOn />
      </p>
      <p>{capitalizedState}</p>
      {/* <p className="mx-4">|</p>
        <p className="">4.4  </p>
        <p className="ml-1 text-xs">⭐</p> */}
    </div>
  );
};

export default VehicleStats;