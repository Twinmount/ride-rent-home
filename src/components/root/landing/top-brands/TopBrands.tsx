import './TopBrands.scss'
import MotionSection from '@/components/general/framer-motion/MotionSection'
import CarouselWrapper from '@/components/common/carousel-wrapper/CarouselWrapper'
import ViewAllButton from '@/components/general/button/ViewAllButton'
import { BrandType, FetchTopBrandsResponse } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

export const fetchCache = 'default-cache'

export default async function TopBrands({
  category,
  state,
}: {
  category: string | undefined
  state: string | undefined
}) {
  const baseUrl = process.env.API_URL
  // Fetch brand data from your API endpoint
  const response = await fetch(
    `${baseUrl}/vehicle-brand/top-brands?categoryValue=${category}`,
    { method: 'GET' }
  )

  // Parse the JSON response
  const data: FetchTopBrandsResponse = await response.json()

  // Extract the list of brands from the response
  const brands = data?.result || []

  const baseAssetsUrl = process.env.ASSETS_URL

  if (brands.length === 0) return null

  return (
    <MotionSection className="top-brands-section wrapper">
      <h2 className="common-heading">
        Rent from top brands in{' '}
        <span className="capitalize yellow-gradient p-1 rounded-xl">
          {state}
        </span>
      </h2>

      <CarouselWrapper>
        {brands.map((brand: BrandType) => (
          <Link
            href={`/${state}/listing?brand=${brand.brandValue}&category=${category}`}
            key={brand.id}
            className="brand-card slide-visible"
          >
            <div className="image-box">
              <Image
                src={`${baseAssetsUrl}/icons/brands/bugatti.png`}
                width={80}
                height={80}
                alt={brand.brandName}
              />
            </div>
            <div className="brand-info truncate">{brand.brandName}</div>
          </Link>
        ))}
      </CarouselWrapper>

      <ViewAllButton link={`/${state}/${category}/brands`} />
    </MotionSection>
  )
}
