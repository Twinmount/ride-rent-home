/**
 * VehicleGridWrapper is a component that wraps its children in a responsive grid layout. Used in landing page Main Grid, Vehicle Series Page, Listing Page.
 * @param children - The content to be displayed inside the grid.
 * @param classNames - Optional additional classes to apply to the grid container.
 */
export default function VehicleGridWrapper({
  children,
  classNames,
}: {
  children: React.ReactNode;
  classNames?: string;
}) {
  return (
    <div
      className={`mx-auto grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${classNames}`}
    >
      {children}
    </div>
  );
}
