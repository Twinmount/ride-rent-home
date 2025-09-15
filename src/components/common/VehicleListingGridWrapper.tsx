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
      className={`mx-auto grid w-full max-w-full grid-cols-2 justify-items-stretch gap-4 px-1 sm:px-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ${classNames}`}
    >
      {children}
    </div>
  );
};

export default VehicleListingGridWrapper;
