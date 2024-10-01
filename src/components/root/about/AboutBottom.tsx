import MotionDiv from '@/components/general/framer-motion/MotionDiv'
import { aboutFeatures } from '.'

export default function AboutBottom() {
  return (
    <div className="max-w-[100rem] mx-auto px-6 md:px-10 lg:px-28 pt-10 pb-1">
      {/* why we exist */}
      <div className="mb-8">
        <h3 className="custom-heading w-fit text-3xl font-bold text-slate-950 !mb-8">
          Why We Exist !?
        </h3>
        <p className="text-gray-800 ">
          In today&apos;s rapidly evolving world, accessibility to luxury and
          convenience is a priority for many. Whether it&apos;s cruising down
          the coast in a convertible sports car, navigating the waters in a
          sleek yacht, or soaring through the skies in a private jet, people
          seek experiences that elevate their lifestyles. Yet, finding these
          luxury vehicles often involves intermediaries, inflated costs, and
          complicated booking processes. Ride.Rent exists to eliminate these
          barriers and create a direct, no-commission platform for vehicle
          owners and users alike.
          <br /> <br /> Ride.Rent was founded in 2024 with a singular vision: to
          revolutionize the vehicle rental industry by providing a platform that
          connects vehicle owners with potential renters without involving
          costly middlemen. Ride.Rent is based in Dubai, a city known for its
          luxury lifestyle and demand for high-end services, a platform that
          caters to both the local and international markets, offering a
          seamless and efficient rental process.
        </p>
      </div>

      {/* our purpose */}
      <div className="mb-8">
        <h3 className="custom-heading w-fit text-3xl font-bold text-slate-950 !mb-6">
          Our Purpose
        </h3>
        <h4 className="text-2xl font-normal mb-4 ">
          Direct Access, Maximum Value
        </h4>
        <p className="text-gray-800 ">
          At Ride.Rent, we recognized a gap in the market: while there are
          countless platforms for booking vehicles, very few offer direct access
          to owners without charging hefty commissions. Traditional platforms
          take a percentage from both owners and renters, inflating prices and
          decreasing the overall value for both parties. Ride.Rent exists to
          change that by offering a platform where vehicle owners can list their
          assets and receive 100% of the rental income.
          <br /> <br /> For renters, Ride.Rent provides an easy-to-use platform
          where they can browse listings, contact owners directly, and arrange
          bookings—no third-party fees, no hidden costs. This ensures the best
          possible value for everyone involved.
        </p>
      </div>

      {/* features */}
      <div className="flex flex-col items-center w-full mx-auto my-4 gap-y-4 md:w-4/5 ">
        {aboutFeatures.map((feature) => (
          <MotionDiv
            className="border-gray-500/20 shadow-lg p-2 rounded-[1rem] bg-white md:py-2 md:px-4  border-t border-t-gray-200"
            key={feature.key}
          >
            <h4 className="mb-2 font-semibold text-center">{feature.title}</h4>
            <p className="text-center text-[0.9rem] text-gray-700 w-full mx-auto md:w-11/12">
              {feature.description}
            </p>
          </MotionDiv>
        ))}
      </div>
    </div>
  )
}
