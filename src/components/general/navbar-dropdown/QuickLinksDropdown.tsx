'use client'

import { useQuery } from '@tanstack/react-query'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import { FaLink } from 'react-icons/fa6'
import { fetchQuickLinksByValue } from '@/lib/next-api/next-api'
import { LinkType } from '@/types'
import { useParams, usePathname } from 'next/navigation'

export default function QuickLinksDropdown() {
  const pathname = usePathname()
  const { state } = useParams<{ state: string; category: string }>()

  // Fetch quick links based on the current state
  const { data, isLoading } = useQuery({
    queryKey: ['quick-links', state],
    queryFn: () => fetchQuickLinksByValue(state),
    enabled: !!state,
    staleTime: 0,
  })

  const linksData: LinkType[] = data?.result?.list || []

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
    <NavigationMenu className="-ml-2">
      <NavigationMenuList>
        <NavigationMenuItem className="!rounded-xl ">
          <NavigationMenuTrigger className={''} disabled={isLoading}>
            <FaLink className={`text-orange mr-1 text-lg `} />
            <span>Quick Links</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="!w-64 flex flex-col p-1 shadow-md !bg-white gap-1">
            {linksData.length > 0 ? (
              linksData.map((item) => (
                <Link
                  key={item.linkId}
                  href={item.link}
                  className={`cursor-pointer p-1 px-2 !rounded-xl flex items-center gap-x-1 hover:text-orange `}
                >
                  <FaLink className={`mr-1 text-base`} />
                  <span
                    className={`!text-sm whitespace-nowrap hover:text-orange truncate`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))
            ) : (
              <div className="rounded-md p-1">Oops! No Links found</div>
            )}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
