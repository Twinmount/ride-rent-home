"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ImageSrc } from "./Banner";
import Image from "next/image";

const CustomArrow = ({
  onClick,
  direction,
}: {
  onClick?: () => void;
  direction: "prev" | "next";
}) => (
  <button
    className={`absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-yellow focus:outline-none ${
      direction === "prev" ? "left-4" : "right-4"
    }`}
    onClick={onClick}
    aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-all duration-100 hover:scale-125 ${direction === "next" ? "rotate-180" : ""}`}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  </button>
);

export default function BannerSlider({
  bannerImages,
}: {
  bannerImages: ImageSrc[];
}) {
  /* Slider configuration */
  const settings = {
    dots: true,
    infinite: bannerImages?.length > 1,
    autoplay: bannerImages?.length > 1,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: bannerImages?.length > 1,
    fade: false,
    speed: 600,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    lazyLoad: "ondemand" as const,
    prevArrow: <CustomArrow direction="prev" />,
    nextArrow: <CustomArrow direction="next" />,
    customPaging: (i: number) => (
      <div className="h-2 w-2 cursor-pointer rounded-full bg-white/40 transition-all duration-300 hover:bg-white/80">
        <span className="sr-only">Slide {i + 1}</span>
      </div>
    ),
  };

  return (
    <div className="modern-banner-slider absolute inset-0 w-full min-w-full">
      <Slider {...settings}>
        {bannerImages?.length > 0 &&
          bannerImages?.map((image, index) => {
            /* Slide content structure */
            const slideContent = (
              <div className="relative h-full w-full">
                <Image
                  src={image?.src}
                  alt={`Banner ${index + 1}`}
                  fill
                  className="object-cover object-top"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "low"}
                  sizes="100vw"
                  quality={index === 0 ? 90 : 85}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            );

            /* Conditional link wrapper */
            if (!!image?.link) {
              return (
                <a
                  key={`dashboard-banner-item__${index + 1}`}
                  className="block h-full w-full"
                  href={image?.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Banner ${index + 1} - External link`}
                >
                  {slideContent}
                </a>
              );
            }

            /* Default slide without link */
            return (
              <div
                key={`dashboard-banner-item__${index + 1}`}
                className="h-full w-full"
              >
                {slideContent}
              </div>
            );
          })}
      </Slider>
    </div>
  );
}
