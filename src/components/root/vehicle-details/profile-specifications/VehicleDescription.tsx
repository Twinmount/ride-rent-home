type VehicleDescriptionProps = {
  description?: string;
};

const VehicleDescription = ({ description }: VehicleDescriptionProps) => {
  return (
    <div className="- m-2 text-justify text-sm text-text-secondary">
      {description}
    </div>
  );
};

export default VehicleDescription;
