"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ImageSrc } from "./Banner";

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
    arrows: false,
    fade: false,
    speed: 600,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    /* Custom dot styling */
    customPaging: (i: number) => (
      <div className="w-2 h-2 bg-white/40 rounded-full hover:bg-white/80 transition-all duration-300 cursor-pointer">
        <span className="sr-only">Slide {i + 1}</span>
      </div>
    ),
  };

  return (
    <div className="modern-banner-slider">
      <Slider {...settings}>
        {bannerImages?.length > 0 &&
          bannerImages?.map((image, index) => {
            /* Slide content structure */
            const slideContent = (
              <div className="relative h-full w-full">
                <img
                  src={image?.src}
                  alt={`Banner ${index + 1}`}
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
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