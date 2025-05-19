import { headers } from 'next/headers';
import { ENV } from '@/config/env';
import BannerSlider from './BannerSlider';

const API_URL = ENV.API_URL;

async function getBannerImages(state: string, isMobile: boolean): Promise<string[]> {
  try {
    const res = await fetch(
      `${API_URL}/homepage-banners/list?state=${state}&isMobile=${isMobile}`,
      { method: 'GET', cache: 'no-cache' }
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

export default async function Banner({ state }: { state: string }) {
  const headersList = await headers(); 
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);

  const bannerImages = await getBannerImages(state, isMobile);

  return <BannerSlider bannerImages={bannerImages} />;
}
