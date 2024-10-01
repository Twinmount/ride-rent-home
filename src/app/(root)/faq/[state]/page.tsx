import HeadingBanner from '@/components/general/heading-banner/HeadingBanner'
import FAQ from '@/components/common/FAQ/FAQ'
import { PageProps } from '@/types'

export async function generateMetadata({ params: { state } }: PageProps) {
  const canonicalUrl = `https://ride.rent/faq/${state}`
  const title = `Frequently Asked Questions - Ride Rent - ${state}`
  const description = `Find answers to frequently asked questions about renting vehicles in ${state}. Learn more about vehicle rentals, services, and policies.`

  return {
    title,
    description,
    keywords: `FAQ, frequently asked questions, vehicle rental in ${state}, Ride Rent`,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default function FAQPage({ params: { state } }: PageProps) {
  return (
    <section>
      <HeadingBanner heading="Frequently Asked Questions" />

      <FAQ stateValue={state || 'dubai'} />
    </section>
  )
}
