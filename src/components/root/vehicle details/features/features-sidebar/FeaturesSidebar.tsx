import { BsEyeFill } from 'react-icons/bs'
import './FeaturesSidebar.scss'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { FeatureType } from '@/types/vehicle-types'
import { formatKeyForIcon } from '@/helpers'

type FeaturesSidebarProps = {
  features: Record<string, FeatureType[]>
  vehicleCategory: string
}

export default function FeaturesSidebar({
  features,
  vehicleCategory,
}: FeaturesSidebarProps) {
  // Base URL for fetching icons
  const baseAssetsUrl = process.env.ASSETS_URL

  // Convert features object to an array for easier mapping
  const featureEntries = Object.entries(features)

  return (
    <Sheet>
      <SheetTrigger className="bg-orange p-1 rounded-2xl text-white mb-2 px-4 shadow-sm hover:shadow-lg transition-transform  ease-in-out hover:scale-[1.01] active:scale-[0.99] flex items-center gap-x-2">
        Show All <BsEyeFill />
      </SheetTrigger>
      <SheetContent className="bg-white overflow-auto !z-[61]">
        <SheetHeader>
          <SheetTitle className="custom-heading feature-sidebar-heading text-2xl">
            Features
          </SheetTitle>
          <div className="features-container">
            {featureEntries.map(([category, featureList]) => (
              <div key={category} className="feature-sub-section">
                <div className="sub-heading-container">
                  <div className="sub-heading-icon">
                    <img
                      src={`${baseAssetsUrl}/icons/vehicle-features/${formatKeyForIcon(
                        category
                      )}.svg`}
                      alt={`${category} icon`}
                      className="icon"
                    />
                  </div>
                  <h3 className="sub-heading">{category}</h3>
                </div>
                <div className="sub-feature-container">
                  {featureList.map((feature) => (
                    <div className="feature" key={feature.value}>
                      <span className="entity">&raquo;</span>
                      {feature.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
