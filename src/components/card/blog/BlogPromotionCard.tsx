import Image from "next/image";
import Link from "next/link";
import HoverOverlay from "@/components/common/HoverOverlay";
import { CarouselItem } from "../../ui/carousel";

// single promotion type
interface PromotionType {
  promotionId: string;
  promotionImage: string;
  promotionLink: string;
}

const BlogPromotionCard = ({
  promotionImage,
  promotionLink,
}: PromotionType) => {
  return (
<<<<<<< HEAD
    <CarouselItem className="mx-auto h-[23rem] w-full min-w-[17rem] max-w-[20rem] overflow-hidden md:max-w-[21rem] lg:h-[18rem]">
=======
    <CarouselItem className="mx-auto h-[23rem] w-full min-w-[17rem] overflow-hidden md:max-w-[21rem] lg:h-[18rem]">
>>>>>>> c59e81bf06631eb0743f028ec23a47d93a9150fb
      <Link
        href={promotionLink}
        target="_blank"
        rel="noopener noreferrer"
        className="h-full min-h-full w-full min-w-full"
      >
        <div className="group relative h-full min-h-full w-full min-w-full cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg">
          <figure className="relative flex h-full w-full items-center justify-center">
            {promotionImage ? (
              <Image
                src={promotionImage}
                alt="Promotion"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                width={400}
                height={600}
              />
            ) : (
              <Image
                src={"/assets/bg/blur.jpg"}
                alt="Promotion"
                className="h-full w-full object-cover"
                width={400}
                height={600}
              />
            )}
            <HoverOverlay label="Visit" />
          </figure>
        </div>
      </Link>
    </CarouselItem>
  );
};

export default BlogPromotionCard;
