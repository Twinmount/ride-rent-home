import './Landing.scss'
import { FaRegThumbsUp } from 'react-icons/fa'
import BackgroundDiv from './BackgroundDiv'
import MotionDiv from '@/components/general/framer-motion/MotionDiv'
import Link from 'next/link'
import VehicleCategories from '../vehicle-categories/VehicleCategories'
import { StateCategoryProps } from '@/types'

const Landing = ({ state, category }: StateCategoryProps) => {
  return (
    <section className="landing-section  ">
      <div className="landing-top">
        {/* mobile visible button */}
        <Link
          href={`${process.env.NEXT_PUBLIC_AGENT_REGISTER_URL}`}
          target="_blank"
          rel="noopener noreferrer"
          id="mobile-list-btn"
          className="yellow-gradient default-btn mobile-list-btn"
        >
          List your vehicle for FREE
        </Link>
        {/* landing top */}
        {/* wrapping with custom child component div for bg image */}
        <BackgroundDiv category={category}>
          <MotionDiv className={`landing-text-container`}>
            <p className="trust">
              <FaRegThumbsUp />
              Most Trusted <span className="capitalize">{category}</span> Rental
              Services In <span className="capitalize">{state}</span> !
            </p>
            <div>
              <p>Best Prices & No Commission</p>
              <p>More than 1000+ options to choose from...</p>
            </div>
            <button id="view-all-cars" className="default-btn yellow-gradient">
              View all cars
            </button>
          </MotionDiv>
        </BackgroundDiv>

        {/* Vehicle categories  */}
        <VehicleCategories category={category} state={state} />
      </div>
      <div className="landing-bottom">
        <p>
          <span>Ride.Rent</span> ensures that you have access to the best and
          <span>
            {' '}
            most affordable {category} rental services in{' '}
            <span className="capitalize">{state}</span>&nbsp;!.
          </span>
          Take advantage of our exceptional offers on car rentals throughout
          Dubai, with Ride On Rent, each car is well maintained and pre-serviced
          for efficient performance. <br />
          For your peace of mind, all vehicles are insured and come with
          dedicated agent assistance.
        </p>

        <div className="near-car">
          <p>Find {category} near you in</p>
          <span>{state}</span>
        </div>
      </div>
    </section>
  )
}
export default Landing
