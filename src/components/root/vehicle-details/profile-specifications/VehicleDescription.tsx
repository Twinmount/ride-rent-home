type VehicleDescriptionProps = {
  description?: string;
};

const VehicleDescription = ({ description }: VehicleDescriptionProps) => {
  return (
    <div className="m-2 text-sm text-text-secondary lg:text-base">
      {description}
    </div>
  );
};

export default VehicleDescription;
