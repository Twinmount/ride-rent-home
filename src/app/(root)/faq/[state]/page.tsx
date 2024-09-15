import HeadingBanner from '@/components/general/heading-banner/HeadingBanner'
import FAQ from '@/components/common/FAQ/FAQ'
import { PageProps } from '@/types'

export default function FAQPage({ params: { state } }: PageProps) {
  return (
    <section>
      <HeadingBanner heading="Frequently Asked Questions" />

      <FAQ stateValue={state || 'dubai'} />
    </section>
  )
}
