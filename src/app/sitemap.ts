import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const states = [
    { stateValue: 'dubai' },
    { stateValue: 'sharjah' },
    { stateValue: 'abu-dhabi' },
    { stateValue: 'al-ain' },
    { stateValue: 'ras-al-khaima' },
    { stateValue: 'fujairah' },
    { stateValue: 'umm-al-quwain' },
    { stateValue: 'ajman' },
  ]

  const categories = [
    { value: 'yachts' },
    { value: 'vans' },
    { value: 'sports-cars' },
    { value: 'sports-bikes' },
    { value: 'motorcycles' },
    { value: 'leisure-boats' },
    { value: 'charters' },
    { value: 'cars' },
    { value: 'buses' },
    { value: 'buggies' },
  ]

  // Static pages to be included in the sitemap
  const staticPages = [
    {
      url: 'https://ride.rent/about-us',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: 'https://ride.rent/faq',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: 'https://ride.rent/privacy-policy',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: 'https://ride.rent/terms-condition',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Generate sitemap entries for each state/category combination
  const dynamicRoutes: MetadataRoute.Sitemap = states.flatMap((state) => {
    return categories.map((category) => ({
      url: `https://ride.rent/${state.stateValue}/${category.value}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1,
    }))
  })

  // Combine static pages with dynamic routes
  const sitemapEntries = [...staticPages, ...dynamicRoutes]

  return sitemapEntries
}
