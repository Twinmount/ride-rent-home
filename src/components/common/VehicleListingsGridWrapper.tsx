export default function VehicleListingsGridWrapper({
  children,
  classNames,
}: {
  children: React.ReactNode;
  classNames?: string;
}) {
  // this is used as the grid wrapper in the listing page as well as series page
  return (
    <div className={`mx-auto grid w-fit max-w-fit grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${classNames}`}>
      {children}
    </div>
  );
}
