'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { FaLocationDot } from 'react-icons/fa6'
import { useQuery } from '@tanstack/react-query'
import { fetchStates } from '@/lib/next-api/next-api'
import { StateType } from '@/types'
import { useEffect, useState } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

export default function StatesDropdown() {
  const router = useRouter()
  const pathname = usePathname()

  // State to hold the selected state
  const [selectedState, setSelectedState] = useState<StateType | undefined>(
    undefined
  )
  const { state, category } = useParams<{ state: string; category: string }>()

  // Query to fetch states
  const { data, isLoading } = useQuery({
    queryKey: ['states'],
    queryFn: fetchStates,
    staleTime: 0,
  })

  const states: StateType[] = data?.result || []

  // List of paths where the component should not render
  const excludePaths = ['/terms-condition', '/about-us', '/privacy-policy']

  // Use startsWith to exclude dynamic paths like /faq and /faq/{state}
  const shouldExclude =
    pathname.startsWith('/faq') || excludePaths.includes(pathname)

  // Only run the useEffect if the current path is NOT in the excludePaths
  useEffect(() => {
    if (!shouldExclude && states.length > 0) {
      const foundState = states.find((data) => data.stateValue === state)
      if (foundState) {
        setSelectedState(foundState)
      } else {
        // Set default state to "Dubai"
        const defaultState = states.find((data) => data.stateValue === 'dubai')
        if (defaultState) {
          setSelectedState(defaultState)
          // Navigate to the "Dubai" state if the state is not found
          router.push(`/dubai/${category}`)
        }
      }
    }
  }, [state, states, shouldExclude])

  // If the current path is in the excludePaths list, return null and don't render the component
  if (shouldExclude) {
    return null
  }

  // Function to handle state selection
  const handleStateSelect = (stateValue: string) => {
    router.push(`/${stateValue}/${category}`) // Navigate to the selected state
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`flex items-center !rounded-xl border-none outline-none`}
      >
        <FaLocationDot
          width={20}
          height={20}
          className={`text-orange mr-1 text-lg`}
        />
        <span className="font-semibold">
          {selectedState ? selectedState.stateName : 'Select Location'}
        </span>
        <ChevronDown className="text-yellow " width={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="!w-44 flex flex-col p-1 bg-white shadow-md !rounded-xl gap-1">
        {states.length > 0 ? (
          states.map((data) => (
            <DropdownMenuItem
              key={data.stateId}
              onClick={() => handleStateSelect(data.stateValue)}
              className={`cursor-pointer p-1 px-2 flex gap-x-1 items-center !rounded-xl hover:text-orange ${
                data.stateValue === state ? 'text-orange' : ''
              }`}
            >
              <FaLocationDot className={`text-orange scale-90`} />
              <span className="text-base">{data.stateName}</span>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No states found</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
