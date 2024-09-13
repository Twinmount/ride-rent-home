'use client'

import styles from '../navbar/Navbar.module.scss'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { FaLocationDot } from 'react-icons/fa6'
import { useQuery } from '@tanstack/react-query'
import { fetchStates } from '@/lib/next-api/next-api'
import { StateType } from '@/types'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, usePathname } from 'next/navigation'

export default function StatesDropdown() {
  // State to hold the selected state
  const [selectedState, setSelectedState] = useState<StateType | undefined>(
    undefined
  )
  const { state, category } = useParams<{ state: string; category: string }>()
  const pathname = usePathname()

  const { data, isLoading } = useQuery({
    queryKey: ['states'],
    queryFn: fetchStates,
    staleTime: 0,
  })

  const states: StateType[] = data?.result || []

  // Find the current state object based on the URL
  useEffect(() => {
    if (states.length > 0) {
      const foundState = states.find((data) => data.stateValue === state)
      if (foundState) {
        setSelectedState(foundState)
      } else {
        // If no specific state is found, set the first state as default
        setSelectedState(states[0])
      }
    }
  }, [state, states])

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
    <NavigationMenu className="-mr-10 max-lg:-mr-5">
      <NavigationMenuList>
        <NavigationMenuItem className="!rounded-xl">
          <NavigationMenuTrigger
            className={`${styles['nav-item']} ${styles['nav-items-icon']} border-none outline-none !w-auto truncate flex justify-end`}
            disabled={isLoading}
          >
            <FaLocationDot
              width={20}
              height={20}
              className={`${styles['nav-items-icon']}`}
            />
            <span>
              {selectedState ? selectedState.stateName : 'Select Location'}
            </span>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="!w-44 flex flex-col p-1 bg-white shadow-md !rounded-xl gap-1">
            {states.length > 0 ? (
              states.map((data) => (
                <Link
                  key={data.stateId}
                  href={`/${data.stateValue}/${category}`}
                  className={`cursor-pointer p-1 px-2 flex gap-x-1 items-center !rounded-xl hover:text-orange ${
                    data.stateValue === state ? 'text-yellow' : ''
                  }`}
                >
                  <FaLocationDot
                    className={`${styles['nav-items-icon']} scale-90`}
                  />
                  <span className="text-base">{data.stateName}</span>
                </Link>
              ))
            ) : (
              <div>No states Found</div>
            )}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
