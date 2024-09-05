'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formUrlQuery, removeKeysFromQuery } from '@/helpers'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react' // Assuming you use Lucide icons

const BrandSearch: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get the initial search query from URL parameters
  const initialQuery = searchParams.get('search') || ''
  const initialCategory = searchParams.get('category') || ''
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    // If there's a search parameter, initialize the query with it
    if (initialQuery) {
      setQuery(initialQuery)
    }
  }, [initialQuery, initialCategory])

  const handleSearchClick = () => {
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
  }

  return (
    <div className="input-box flex items-center">
      <Input
        type="search"
        placeholder="Search brand..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-grey-50 h-[44px] focus-visible:ring-offset-0 focus:border-yellow placeholder:text-grey-500 rounded-full p-regular-16 px-4 py-3 border-slate-300 focus-visible:ring-transparent max-w-96"
      />
      <Button
        onClick={handleSearchClick}
        className="bg-yellow w-10 p-1 ml-2 overflow-hidden rounded-2xl text-white hover:bg-yellow group active:scale-[0.97] transition-transform"
        aria-label="Search Brands"
      >
        <Search className="h-5 w-5 text-white" />
      </Button>
    </div>
  )
}

export default BrandSearch
