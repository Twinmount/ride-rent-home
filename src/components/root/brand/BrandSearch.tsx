'use client'

import { Input } from '@/components/ui/input'
import { formUrlQuery, removeKeysFromQuery } from '@/helpers'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const BrandSearch: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')

  useEffect(() => {
    // Debounce the search functionality using setTimeout
    const delayDebounceFn = setTimeout(() => {
      let newUrl = ''

      if (query) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'search',
          value: query,
        })
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ['search'],
        })
      }

      router.push(newUrl, { scroll: false })
    }, 600) // Adjust the delay based on preference (300ms in this case)

    return () => clearTimeout(delayDebounceFn) // Cleanup the timeout on every re-render
  }, [query, searchParams, router])

  return (
    <div className="input-box flex justify-start mb-6 mr-auto  max-w-96 ">
      <Input
        type="search"
        placeholder={`Search brand...`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-grey-50 h-[44px] focus-visible:ring-offset-0 focus:border-yellow placeholder:text-grey-500 rounded-full p-regular-16 px-4 py-3 border-slate-300 w-full focus-visible:ring-transparent max-w-96"
      />
    </div>
  )
}

export default BrandSearch
