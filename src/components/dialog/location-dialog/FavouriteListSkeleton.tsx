function FavouriteListSkeleton() {
  return (
    <div className="mt-3">
      <div className="mb-3 h-5 w-40 animate-pulse bg-gray-300"></div>
      <div>
        <ul className="-me-2 -ms-2 flex flex-wrap gap-y-2">
          <li className="flex basis-1/5 flex-col px-2">
            <div className="h-16 animate-pulse gap-1 rounded border border-neutral-50 bg-gray-300 py-2"></div>
          </li>
          <li className="basis-1/5 flex-col px-2">
            <div className="flex h-16 animate-pulse gap-1 rounded border border-neutral-50 bg-gray-300 py-2"></div>
          </li>
          <li className="basis-1/5 flex-col px-2">
            <div className="flex h-16 animate-pulse gap-1 rounded border border-neutral-50 bg-gray-300 py-2"></div>
          </li>
          <li className="basis-1/5 flex-col px-2">
            <div className="flex h-16 animate-pulse gap-1 rounded border border-neutral-50 bg-gray-300 py-2"></div>
          </li>
          <li className="basis-1/5 flex-col px-2">
            <div className="flex h-16 animate-pulse gap-1 rounded border border-neutral-50 bg-gray-300 py-2"></div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FavouriteListSkeleton;