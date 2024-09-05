import { FetchCategoriesResponse } from '@/types'
import Link from 'next/link'

export default async function FooterVehicleCategories() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL

  // Fetch the states data from the API
  const response = await fetch(
    `${baseUrl}/vehicle-category/list?page=1&limit=20&sortOrder=ASC`
  )
  const data: FetchCategoriesResponse = await response.json()

  // Extract the states list from the response
  const categories = data.result.list

  return (
    <div className="footer-section">
      {/* category  link */}
      <h3 className="footer-grid-headings">Vehicle Categories</h3>
      <div className="footer-links">
        {categories.map((category) => (
          <Link
            href={`/dubai/${category.value}`}
            className="link-wrapper"
            key={category.categoryId}
          >
            &sdot; <span className="link">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
