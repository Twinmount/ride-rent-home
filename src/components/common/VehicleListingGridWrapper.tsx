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
      className={`mx-auto grid w-full max-w-full grid-cols-1 justify-items-stretch gap-3 sm:grid-cols-1 sm:px-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 ${classNames}`}
    >
      {children}
    </div>
  );
};

export default VehicleListingGridWrapper;
