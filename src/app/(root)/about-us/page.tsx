import MotionDiv from '@/components/general/framer-motion/MotionDiv'
import './AboutUs.scss'

import HeadingBanner from '@/components/general/heading-banner/HeadingBanner'

export default function AboutUs() {
  return (
    <section className="privacy-section">
      <HeadingBanner heading="About Us" />
      <MotionDiv className="bottom">
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Suscipit
          dolorem atque ab perferendis dolores rerum maxime possimus? Repellat
          voluptatum molestiae delectus! Quia, itaque explicabo commodi
          doloremque autem deleniti sapiente quibusdam?
        </p>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore,
          cumque. Beatae, debitis impedit consequatur tempore voluptas expedita
          unde corporis architecto ab nesciunt assumenda, magni non iste est
          soluta nulla sed.
        </p>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident
          incidunt dicta aperiam quas eum officia magnam impedit perspiciatis
          veritatis est. Lorem ipsum dolor sit amet, consectetur adipisicing
          elit. Provident incidunt dicta aperiam quas eum officia magnam impedit
          perspiciatis veritatis est.
        </p>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore,
          cumque. Beatae, debitis impedit consequatur tempore voluptas expedita
          unde corporis architecto ab nesciunt assumenda, magni non iste est
          soluta nulla sed. Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Tempora perspiciatis rerum corporis, ipsa nisi iure dolor modi
          consectetur nihil quisquam!
        </p>
      </MotionDiv>
    </section>
  )
}
