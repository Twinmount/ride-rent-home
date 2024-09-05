'use client'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { MdManageSearch } from 'react-icons/md'
import { useQuery } from '@tanstack/react-query'
import { fetchCategories } from '@/lib/next-api/next-api'
import { CategoryType } from '@/types'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, usePathname } from 'next/navigation'

export default function CategoryDropdown() {
  const pathname = usePathname()
  const { state, category } = useParams<{ state: string; category: string }>()

  // State to hold the selected category
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryType | undefined
  >(undefined)

  // Fetch categories using react-query
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const categories: CategoryType[] = data?.result?.list || []

  // Set the selected category based on the provided prop or default to the first category
  useEffect(() => {
    if (categories.length > 0) {
      const foundCategory = categories.find((cat) => cat.value === category)
      if (foundCategory) {
        setSelectedCategory(foundCategory)
      } else {
        // If no specific category is found, set the first category as default
        setSelectedCategory(categories[0])
      }
    }
  }, [category, categories])

  // List of paths where the component should not render
  const excludePaths = [
    '/terms-condition',
    '/faq',
    '/about-us',
    '/privacy-policy',
  ]

  // Check if the current path is in the excludePaths list
  if (excludePaths.includes(pathname)) {
    return null
  }

  return (
    <NavigationMenu className="-ml-5">
      <NavigationMenuList>
        <NavigationMenuItem className="!rounded-xl">
          <NavigationMenuTrigger className="">
            <MdManageSearch className="text-orange mr-1 text-lg" />
            <span>
              {selectedCategory ? selectedCategory.name : 'Select Category'}
            </span>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="!w-32 flex flex-col p-1 shadow-md !bg-white gap-1">
            {categories.map((cat) => (
              <Link
                key={cat.categoryId}
                href={`/${state}/${cat.value}`}
                className="cursor-pointer p-1 px-2 !rounded-xl flex items-center gap-x-1 hover:text-orange"
              >
                <span
                  className={`!text-sm whitespace-nowrap hover:text-orange ${
                    cat.value === selectedCategory?.value ? 'text-orange' : ''
                  }`}
                >
                  {cat.name}
                </span>
              </Link>
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
