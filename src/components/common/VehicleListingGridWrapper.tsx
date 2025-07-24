import React from 'react';

const VehicleListingGridWrapper = ({
  children,
  classNames = '',
}: {
  children: React.ReactNode;
  classNames?: string;
}) => {
  return (
    // <div
    //   className={`mx-auto grid w-full grid-cols-[repeat(auto-fit,minmax(250px,1fr))] justify-items-center gap-4 sm:justify-items-start ${classNames}`}
    // >
    <div
      className={`mx-auto grid w-fit max-w-full grid-cols-2 justify-items-center gap-4 px-1 sm:justify-items-start sm:px-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 ${classNames}`}
    >
      {children}
    </div>
  );
};

export default VehicleListingGridWrapper;
