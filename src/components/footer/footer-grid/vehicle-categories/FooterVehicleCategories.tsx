import { sortCategories } from "@/helpers";
import { FetchCategoriesResponse } from "@/types";
import Link from "next/link";

export default async function FooterVehicleCategories() {
  const baseUrl = process.env.API_URL;

  // Fetch the states data from the API
  const response = await fetch(
    `${baseUrl}/vehicle-category/list?page=1&limit=20&sortOrder=ASC`
  );
  const data: FetchCategoriesResponse = await response.json();

  // Extract the states list from the response
  let categories = data.result.list;

  categories = sortCategories(categories);

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
  );
}
