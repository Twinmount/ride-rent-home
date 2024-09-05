'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { formUrlQuery } from '@/helpers'
import { useEffect } from 'react'

const LimitDropdown = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get the current limit from URL parameters or default to 5
  const currentLimit = searchParams.get('limit') || '5'

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = event.target.value

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'limit',
      value: newLimit,
    })

    router.push(newUrl, { scroll: false })
  }

  // Set initial state to URL on component mount
  useEffect(() => {
    const initialLimit = searchParams.get('limit') || '5'
    if (!searchParams.get('limit')) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'limit',
        value: initialLimit,
      })
      router.replace(newUrl, { scroll: false })
    }
  }, [searchParams, router])

  return (
    <div className="dropdown">
      Show :&nbsp;
      <select value={currentLimit} onChange={handleLimitChange}>
        <option value="5">5</option>
        <option value="10">10</option>
      </select>
    </div>
  )
}

export default LimitDropdown
