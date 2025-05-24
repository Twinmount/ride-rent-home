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
  const settings = {
    dots: true,
    infinite: bannerImages?.length > 1,
    autoplay: bannerImages?.length > 1,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="wrapper banner-slider">
      <Slider {...settings}>
        {bannerImages?.length > 0 &&
          bannerImages?.map((image, index) => {
            if (!!image?.link) {
              return (
                <a
                  className="slick-slide-link"
                  href={image?.link}
                  target="_blank"
                  onDragStart={(e) => e.preventDefault()}
                >
                  <img
                    src={image?.src}
                    alt={`Banner ${index + 1}`}
                    className="mw-100"
                    key={`dashboard-banner-item__${index + 1}`}
                    loading="lazy"
                  />
                </a>
              );
            }

            return (
              <img
                src={image?.src}
                alt={`Banner ${index + 1}`}
                className="mw-100"
                key={`dashboard-banner-item__${index + 1}`}
                loading="lazy"
              />
            );
          })}
      </Slider>
    </div>
  );
}