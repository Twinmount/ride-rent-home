import './States.scss'
import Image from 'next/image'
import MotionSection from '@/components/general/framer-motion/MotionSection'
import { FetchStatesResponse, StateType } from '@/types' // Import your types
import Link from 'next/link'

export default async function States({ category }: { category: string }) {
  const baseUrl = process.env.API_URL

  // Fetch the states data from the API
  const response = await fetch(`${baseUrl}/states/list`)
  const data: FetchStatesResponse = await response.json()

  // Extract the states list from the response
  const states = data.result

  return (
    <MotionSection className="location-section wrapper">
      <h2>
        Find Vehicle Rental Offers In Other
        <span> States</span>
      </h2>
      <div className="location-container">
        {/* Map through states and render each one */}
        {states.map((state: StateType) => (
          <Link
            href={`/${state.stateValue}/${category}/listing`}
            key={state.stateId}
            className="location-card "
          >
            <Image
              fill
              src={state.stateImage}
              alt={`${state.stateName} logo`}
            />
            <figcaption>{state.stateName}</figcaption>
          </Link>
        ))}
      </div>
    </MotionSection>
  )
}
