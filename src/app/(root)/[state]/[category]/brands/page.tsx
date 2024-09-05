import './Brands.scss'
import { Suspense } from 'react'
import MotionDiv from '@/components/general/framer-motion/MotionDiv'
import BrandSearch from '@/components/root/brand/BrandSearch'
import { FetchBrandsResponse } from '@/types'
import Link from 'next/link'
import CategoryTabs from '@/components/root/brand/CategoryTabs'
import BrandWrapper from '@/components/root/brand/BrandWrapper'
import Pagination from '@/components/general/pagination/Pagination'

export default async function Brands({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const page = parseInt(searchParams.page || '1', 10)
  const search = searchParams.search || ''
  const category = searchParams.category || ''

  const response = await fetch(
    `${baseUrl}/vehicle-brand/list?page=${page}&limit=20&sortOrder=ASC&categoryValue=${category}&search=${search}`,
    { method: 'GET' }
  )

  // Parse the JSON response
  const data: FetchBrandsResponse = await response.json()

  // Extract the list of brands from the response
  const brands = data?.result?.list || []
  const totalPages = Math.ceil((data?.result?.total || 0) / 20)

  return (
    <section className="brands-section wrapper">
      <MotionDiv className="top">
        {/* brands search */}
        <Suspense fallback={<div>Search...</div>}>
          <BrandSearch />
        </Suspense>

        {/* category tabs */}
        <Suspense fallback={<div>Loading categories...</div>}>
          <CategoryTabs />
        </Suspense>

        {/* brands data */}
        {brands.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 place-items-center gap-y-4 pb-20">
            {brands.map((data) => (
              <BrandWrapper
                key={data.id}
                brandValue={data.brandValue}
                className="w-full bg-white border min-w-32 h-36 rounded-xl"
              >
                <div className="flex-center w-auto h-[7.5rem] p-2 ">
                  <img
                    src={data.brandLogo}
                    alt={data.brandName}
                    className="object-contain w-[95%] h-full max-w-28"
                  />
                </div>
                <div className="max-w-full text-sm font-semibold text-center">
                  {data.brandName}
                </div>
              </BrandWrapper>
            ))}
          </div>
        ) : (
          <div className="flex-center my-32">
            No Brands found{' '}
            {search.length > 0 && (
              <span>
                for <span className="italic">&quot;{search}&quot;</span>
              </span>
            )}
          </div>
        )}
      </MotionDiv>

      <Suspense fallback={<div>Loading Pagination...</div>}>
        <Pagination page={page} totalPages={totalPages} />
      </Suspense>
    </section>
  )
}
