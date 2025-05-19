'use client';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function BannerSlider({ bannerImages }: { bannerImages: string[] }) {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="wrapper banner-slider slick-slider">
      <Slider {...settings}>
        {bannerImages.length > 0 && bannerImages?.map((src, index) => (
          <img
            src={src}
            alt={`Banner ${index + 1}`}
            className="mw-100"
            key={`dashboard-banner-item-no-${index}`}
            loading='lazy'
          />
        ))}
      </Slider>
    </div>
  );
}
