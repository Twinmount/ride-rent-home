'use client'

import { fetchCategories } from '@/lib/next-api/next-api'
import { useQuery } from '@tanstack/react-query'
import { CategoryType } from '@/types'
import { useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery, removeKeysFromQuery } from '@/helpers'
import { useEffect, useMemo } from 'react'

export default function CategoryTabs() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Fetch categories using react-query
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  // Memoize categories to ensure stable reference
  const categories: CategoryType[] = useMemo(() => {
    return data?.result?.list || []
  }, [data])

  // Get the current category from URL params
  const currentCategory = searchParams.get('category')

  // If no category exists in URL, set the first category as default
  useEffect(() => {
    if (categories.length > 0 && !currentCategory) {
      const firstCategory = categories[0].value
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'category',
        value: firstCategory,
      })
      router.replace(newUrl, { scroll: false })
    }
  }, [categories, currentCategory, searchParams, router])

  const handleCategoryClick = (categoryValue: string) => {
    // Remove 'search' from the query params if it exists
    let updatedParams = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: ['search'],
    })

    // Add or update the 'category' param
    updatedParams = formUrlQuery({
      params: updatedParams,
      key: 'category',
      value: categoryValue,
    })

    // Navigate to the new URL
    router.push(updatedParams, { scroll: false })
  }

  return (
    <div className="flex flex-center flex-wrap gap-x-2 my-4">
      {categories.map((category) => (
        <div
          key={category.categoryId}
          className={`cursor-pointer p-1 px-2 rounded-xl ${
            currentCategory === category.value ? 'bg-yellow text-white' : ''
          }`}
          onClick={() => handleCategoryClick(category.value)}
        >
          <span className="!text-sm whitespace-nowrap hover:text-orange">
            {category.name}
          </span>
        </div>
      ))}
    </div>
  )
}
