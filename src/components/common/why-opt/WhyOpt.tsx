import './WhyOpt.scss'
import WhyOptHeading from './WhyOptHeading'
import MotionSection from '@/components/general/framer-motion/MotionSection'

const WhyOpt = () => {
  return (
    <MotionSection className="wrapper why-opt-section">
      <WhyOptHeading />

      <div className="description">
        <p>
          Discover the premier car rental experience with RIDE.RENT, where a
          vast array of vehicles awaits. From timeless classics to the pinnacle
          of modern luxury, our diverse fleet caters to every preference.
          Renting with us is a breeze—simply peruse our extensive selection of
          cars for rent to match your style and budget, and reachout to our
          agents with ease!
          <br />
          <br />
          Seeking a sleek luxury convertible or a cost-effective option for a
          monthly car rental in Dubai? RIDE.RENT has your perfect match on
          standby.
          <br />
          <br />
          Don&apos;t hesitate—secure your ideal car for rent in Dubai with
          RIDE.RENT today!
        </p>
      </div>
    </MotionSection>
  )
}
export default WhyOpt
