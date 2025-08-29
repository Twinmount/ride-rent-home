import { SectionHeading } from '@/components/common/SectionHeading';
import { getHomePageHeading } from '@/helpers/homepage-content.helper';

type HeroSectionProps = {
  country: string;
  state: string;
  category: string;
};

export default function HeroSection({
  country,
  state,
  category,
}: HeroSectionProps) {
  const { title, subtitle } = getHomePageHeading({ country, state, category });

  return <SectionHeading title={title} subtitle={subtitle} isHero />;
}
