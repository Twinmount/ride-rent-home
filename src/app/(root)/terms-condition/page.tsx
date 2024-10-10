import './TermsCondition.scss'
import HeadingBanner from '@/components/general/heading-banner/HeadingBanner'
import MotionDiv from '@/components/general/framer-motion/MotionDiv'
import MainSection from '@/components/term-conditions/MainSection'
import GuestUsersSection from '@/components/term-conditions/GuestUsersSection'
import AgentSubSection from '@/components/term-conditions/AgentSubSection'
import AdvertisersSection from '@/components/term-conditions/AdvertisersSection'

export async function generateMetadata() {
  const canonicalUrl = `https://ride.rent/terms-condition`
  const title = `Terms & Conditions - Ride Rent`
  const description = `Review the terms and conditions for using FleetOrbita Internet Services services, including policies for users, agents, and advertisers.`

  return {
    title,
    description,
    keywords: `terms and conditions, user policies, Ride Rent, rental service terms`,
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

export default function TermsAndCondition() {
  return (
    <section className="terms-condition-section">
      <HeadingBanner heading="Terms & Conditions" />
      <MotionDiv className="container">
        <h2>PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY</h2>

        <MainSection />
        <GuestUsersSection />
        <AgentSubSection />
        <AdvertisersSection />
      </MotionDiv>
    </section>
  )
}
