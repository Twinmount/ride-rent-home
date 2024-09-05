'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery } from '@/helpers'
import { Suspense } from 'react'

type BrandWrapperProps = {
  brandValue: string
  children: React.ReactNode
  className?: string // Optional className for styling
}

const BrandWrapper: React.FC<BrandWrapperProps> = ({
  brandValue,
  children,
  className = '',
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleClick = () => {
    // Create a new URL with the additional brand parameter
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'brand',
      value: brandValue,
    })

    // Navigate to the new URL with the updated brand parameter
    router.push(newUrl, { scroll: false })
  }

  return (
    <Suspense fallback="Loading...">
      <div onClick={handleClick} className={`cursor-pointer ${className}`}>
        {children}
      </div>
    </Suspense>
  )
}

export default BrandWrapper
