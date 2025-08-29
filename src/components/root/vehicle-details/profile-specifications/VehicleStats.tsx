import { CiLocationOn } from "react-icons/ci";

type VehicleStatsProps = {
  state: string;
};

const VehicleStats = ({ state }: VehicleStatsProps) => {
  return (
    <div className="flex  items-center text-sm text-text-secondary p-1 font-light">
        <p className="mr-1"><CiLocationOn /></p>
        <p>{state}</p>
        <p className="mx-4">|</p>
        <p className="">4.4  </p>
        <p className="ml-1 text-xs">⭐</p>
    </div>
  )
}

export default VehicleStats