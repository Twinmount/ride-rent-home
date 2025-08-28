import { IconType } from 'react-icons';
import MotionDiv from '@/components/general/framer-motion/MotionDiv';

type FeatureCardProps = {
  icon: IconType;
  title: string;
  description: string;
};

const FeaturesCard = (props: FeatureCardProps) => {
  const { icon: Icon, title, description } = props;

  return (
    <MotionDiv className="group">
      <div className="flex items-center gap-4 p-0 transition-all duration-300">
        {/* Icon Container */}
        <div className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FCECD2]">
            <Icon className="h-6 w-6 text-accent" />
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h3 className="mb-2 text-sm font-semibold leading-tight text-accent lg:text-lg">
            {title}
          </h3>

          <p className="text-justify text-[0.625rem] text-gray-600 lg:text-sm">
            {description}
          </p>
        </div>
      </div>
    </MotionDiv>
  );
};

export default FeaturesCard;
