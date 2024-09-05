import { SearchX } from 'lucide-react'

export default function NoResultsFound() {
  return (
    <div className=" pt-64 h-screen w-full flex flex-col items-center  text-lg">
      <div className="flex-center gap-x-2 text-lg">
        Oops! No results found! <SearchX width={30} height={30} />
      </div>

      <span className="text-sm text-gray-500 italic">
        Try adjusting your filter
      </span>
    </div>
  )
}
