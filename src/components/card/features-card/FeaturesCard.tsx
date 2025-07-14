import { IconType } from "react-icons";
import MotionDiv from "@/components/general/framer-motion/MotionDiv";

type FeatureCardProps = {
  data: {
    key: number;
    icon: IconType;
    title: string;
    description: string;
    bgClass: string;
  };
};

const FeaturesCard = ({ data }: FeatureCardProps) => {
  const { icon: Icon, title, description } = data;

  return (
    <MotionDiv className="group">
      <div className="flex items-center gap-4 p-0 transition-all duration-300">
        {/* Icon Container */}
        <div className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FCECD2] ">
            <Icon className="h-6 w-6 text-accent" />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm lg:text-lg text-accent leading-tight mb-2">
            {title}
          </h3>
          
          <p className="text-[10px] lg:text-sm text-gray-600">
            {description}
          </p>
        </div>
      </div>
    </MotionDiv>
  );
};

export default FeaturesCard;