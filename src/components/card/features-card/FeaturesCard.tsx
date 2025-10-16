import Image from "next/image";
import MotionDiv from "@/components/general/framer-motion/MotionDiv";

type FeatureCardProps = {
  iconNumber: 1 | 2 | 3;
  title: string;
  description: string;
};

const FeaturesCard = (props: FeatureCardProps) => {
  const { iconNumber, title, description } = props;

  const iconMap = {
    1: "/assets/icons/home-icons/features/icon1.svg",
    2: "/assets/icons/home-icons/features/icon2.svg",
    3: "/assets/icons/home-icons/features/icon3.svg",
  };

  return (
    <MotionDiv className="group">
      <div className="flex items-center gap-4 p-0 transition-all duration-300">
        {/* Icon Container */}
        <div className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FCECD2]">
            <Image
              src={iconMap[iconNumber]}
              alt="features-card-icon"
              width={24}
              height={24}
              className="h-6 w-6"
              style={{
                filter:
                  "invert(47%) sepia(98%) saturate(1613%) hue-rotate(359deg) brightness(102%) contrast(101%)",
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h3 className="mb-2 text-sm font-semibold leading-tight text-gray-700 lg:text-lg">
            {title}
          </h3>

          <p className="text-justify text-[0.625rem] text-text-tertiary lg:text-sm">
            {description}
          </p>
        </div>
      </div>
    </MotionDiv>
  );
};

export default FeaturesCard;
