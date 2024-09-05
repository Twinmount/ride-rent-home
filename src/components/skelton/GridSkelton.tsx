import { Skeleton } from '../ui/skeleton'

export default function GridSkelton({ count = 6 }: { count: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array(count)
        .fill(null)
        .map((_, index) => (
          <div key={index} className={`flex flex-col w-32 h-32 space-y-3 `}>
            <Skeleton className={`w-full bg-gray-200 h-28 rounded-xl `} />
            <div className="space-y-2">
              <Skeleton className="w-full h-4 bg-gray-200" />
            </div>
          </div>
        ))}
    </div>
  )
}
