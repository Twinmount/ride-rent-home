'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const data = [
  { id: 1, name: 'Privacy Policy', link: '/privacy-policy' },
  { id: 2, name: 'Terms & Conditions', link: '/terms-condition' },
  { id: 3, name: 'FAQ', link: '/faq' },
  { id: 4, name: 'About Us', link: '/about-us' },
]

export default function BreadCrump() {
  const [currentPage, setCurrentPage] = useState('')

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const currentPageName =
      data.find((item) => item.link === pathname)?.name || ''
    setCurrentPage(currentPageName)
  }, [pathname])

  const handleSelection = (name: string, link: string) => {
    setCurrentPage(name)
    router.push(link)
  }

  return (
    <Breadcrumb className="z-10 mx-auto flex justify-center">
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href="/" className="text-white">
            Home
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="-ml-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem className="!rounded-xl ">
                <NavigationMenuTrigger className={''}>
                  <span className="text-yellow">{currentPage}</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="!w-40 flex flex-col p-1  shadow-md  !bg-white gap-1">
                  {data.map((item) => (
                    <NavigationMenuLink
                      key={item.id}
                      className={`cursor-pointer p-1 px-2 !rounded-xl `}
                      onClick={() => handleSelection(item.name, item.link)}
                    >
                      <span
                        className={`!text-sm whitespace-nowrap hover:text-orange ${
                          currentPage === item.name && 'text-orange'
                        }`}
                      >
                        {item.name}
                      </span>
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
