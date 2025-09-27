import { headers } from 'next/headers';
import { ENV } from '@/config/env';
import BannerSlider from './BannerSlider';

export type ImageSrc = {
  link?: string;
  src: string;
};

async function getBannerImages(
  state: string,
  isMobile: boolean,
  country: string
): Promise<ImageSrc[]> {
  try {
    const baseUrl = country === "in" ? ENV.API_URL_INDIA : ENV.API_URL;
    const res = await fetch(
      `${baseUrl}/homepage-banners/list?state=${state}&isMobile=${isMobile}`,
      {
        method: "GET",
        cache: "force-cache",
        next: { revalidate: 7200 },
      }
    );

    if (!res.ok) throw new Error('Failed to fetch banners');
    const data = await res.json();

    if (data?.status === 'SUCCESS' && Array.isArray(data.result)) {
      return data.result;
    }

    return [];
  } catch (error) {
    console.error('Error fetching banner images:', error);
    return [];
  }
}

export default async function Banner({
  state,
  country,
}: {
  state: string;
  country: string;
}) {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);

  const bannerImages = await getBannerImages(state, isMobile, country);

  return (
    <div className="no-global-padding relative">
      <BannerSlider bannerImages={bannerImages} />
    </div>
  );
}
