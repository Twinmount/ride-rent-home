'use client'

import './GridSwitch.scss'
import { IoGridOutline, IoList } from 'react-icons/io5'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { formUrlQuery } from '@/helpers'
import { useEffect } from 'react'

type GridSwitchProps = {
  isGridView: boolean
}

const GridSwitch = ({ isGridView }: GridSwitchProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Set initial state to URL on component mount
  useEffect(() => {
    const currentView = searchParams.get('view')
    const initialView = isGridView ? 'grid' : 'list'

    if (!currentView) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'view',
        value: initialView,
      })
      router.replace(newUrl, { scroll: false })
    }
  }, [isGridView, searchParams, router])

  const handleViewChange = (view: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'view',
      value: view,
    })

    router.push(newUrl, { scroll: false })
  }

  return (
    <div className="grid-style">
      <button
        className={`icon-container ${isGridView ? 'selected' : ''}`}
        aria-label="Switch to grid view"
        onClick={() => handleViewChange('grid')}
      >
        <IoGridOutline className="icon" />
      </button>
      <button
        className={`icon-container ${!isGridView ? 'selected' : ''}`}
        aria-label="Switch to list view"
        onClick={() => handleViewChange('list')}
      >
        <IoList className="icon" />
      </button>
    </div>
  )
}

export default GridSwitch
