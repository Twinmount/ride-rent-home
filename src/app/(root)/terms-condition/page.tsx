import './TermsCondition.scss'
import HeadingBanner from '@/components/general/heading-banner/HeadingBanner'
import MotionDiv from '@/components/general/framer-motion/MotionDiv'
import MainSection from '@/components/term-conditions/MainSection'
import GuestUsersSection from '@/components/term-conditions/GuestUsersSection'
import AgentSubSection from '@/components/term-conditions/AgentSubSection'
import AdvertisersSection from '@/components/term-conditions/AdvertisersSection'

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
