import React from "react";

const VehicleListingGridWrapper = ({
  children,
  classNames = "",
}: {
  children: React.ReactNode;
  classNames?: string;
}) => {
  return (
    <div
      className={`mx-auto grid w-full grid-cols-[repeat(auto-fit,minmax(250px,1fr))] justify-items-center gap-4 sm:justify-items-start ${classNames}`}
    >
      {children}
    </div>
  );
};

export default VehicleListingGridWrapper;
