import { headers } from "next/headers";
import BannerSlider from "./BannerSlider";
import { API } from "@/utils/API";
import { Slug } from "@/constants/apiEndpoints";
import { getCacheConfig } from "@/utils/cache.utils";
import { CACHE_TAGS } from "@/constants/cache.constants";

export type ImageSrc = {
  link?: string;
  src: string;
};

export default async function Banner({
  state,
  country,
}: {
  state: string;
  country: string;
}) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);

  const res = await API({
    path: `${Slug.GET_HOMEPAGE_BANNER}?state=${state}&isMobile=${isMobile}`,
    options: {
      method: "GET",
      ...getCacheConfig({
        tags: [CACHE_TAGS.HOMEPAGE_BANNER],
      }),
    },
    country: country,
  });

  if (!res.ok) throw new Error("Failed to fetch banners");
  const data = await res.json();

  const bannerImages: ImageSrc[] = data?.result || [];

  return (
    <div className="no-global-padding relative overflow-hidden">
      {bannerImages.length > 0 && (
        <link
          rel="preload"
          as="image"
          href={bannerImages[0].src}
          fetchPriority="high"
        />
      )}
      <BannerSlider bannerImages={bannerImages} />
    </div>
  );
}
