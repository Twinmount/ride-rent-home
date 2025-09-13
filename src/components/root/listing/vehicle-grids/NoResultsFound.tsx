import { SearchX } from "lucide-react";

export default function NoResultsFound({
  isListingPage = true,
}: {
  isListingPage?: boolean;
}) {
  return (
    <div className="flex h-screen w-full flex-col items-center pt-64 text-lg">
      <div className="flex-center gap-x-2 text-lg">
        Oops! No results found! <SearchX width={30} height={30} />
      </div>

      {isListingPage && (
        <span className="text-sm italic text-gray-500">
          Try adjusting your filter
        </span>
      )}
    </div>
  );
}
