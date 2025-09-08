import MotionDiv from '@/components/general/framer-motion/MotionDiv';
import AboutMain from '@/components/root/about/AboutMain';
import AboutBottom from '@/components/root/about/AboutBottom';

export async function generateMetadata() {
  const canonicalUrl = `https://ride.rent/about-us`;
  const title = `About Us - Ride Rent`;
  const description = `Learn more about  FleetOrbita
 Internet Services/Ride Rent LLC, our mission, and how we are simplifying vehicle rentals across the UAE.`;

  return {
    title,
    description,
    keywords: `about us, Ride Rent, vehicle rentals, company information`,
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
  };
}

export default function AboutUs() {
  return (
    <section className="no-global-padding pb-12">
      <MotionDiv>
        <AboutMain />
        <AboutBottom />
      </MotionDiv>
    </section>
  );
}
