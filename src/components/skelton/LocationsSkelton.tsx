import { Skeleton } from '../ui/skeleton'

export default function LocationsSkelton({ count = 4 }: { count: number }) {
  return (
    <div className="flex-center flex-wrap gap-2">
      {Array(count)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="w-12 overflow-hidden bg-white rounded-lg shadow-md h-6"
          >
            <Skeleton className="w-full h-full bg-gray-200 " />
          </div>
        ))}
    </div>
  )
}
