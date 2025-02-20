import { IconType } from "react-icons";
import { clsx } from "clsx";
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
  const { icon: Icon, title, description, bgClass } = data;

  return (
    <MotionDiv className="group mx-auto flex min-h-[13rem] w-auto max-w-[90%] scale-100 cursor-default flex-col rounded-[0.5rem] bg-white p-3 shadow-md transition-all hover:shadow-xl">
      <div
        className={clsx(
          "flex h-16 w-full items-center justify-center rounded-[0.5rem] text-white transition-colors",
          {
            "bg-black": bgClass === "black",
            "bg-[#127384]": bgClass === "blue",
            "bg-yellow": bgClass === "orange",
          },
        )}
      >
        <Icon className="h-6 w-6 transition-transform group-hover:scale-110" />
      </div>
      <h3 className="my-2 text-center text-lg font-medium">{title}</h3>
      <p className="mx-auto w-[90%] text-center text-sm">{description}</p>
    </MotionDiv>
  );
};

export default FeaturesCard;
