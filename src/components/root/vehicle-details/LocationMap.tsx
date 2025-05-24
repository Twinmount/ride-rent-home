import { GPSLocation } from "@/types/vehicle-details-types";

type LocationMapProps = {
  location: GPSLocation;
  mapImage: string;
};

function LocationMap({ location, mapImage }: LocationMapProps) {
  const { lat, lng } = location;

  console.log("lat-lng :>> ", lat, lng);

  return (
    <div className="profile-card mt-4">
      <div className="profile-heading">
        <h2 className="custom-heading">Location map</h2>
      </div>
      <div className="h-full w-full">
        <img src={mapImage} alt="Map image"  />
      </div>
    </div>
  );
}

export default LocationMap;