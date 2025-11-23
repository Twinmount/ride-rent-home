import { headers } from "next/headers";
import BannerSlider from "./BannerSlider";
import { API } from "@/utils/API";
import { Slug } from "@/constants/apiEndpoints";

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
    const url = `${Slug.GET_HOMEPAGE_BANNER}?state=${state}&isMobile=${isMobile}`;
    const res = await API({
      path: url,
      options: {
        method: "GET",
        cache: "no-cache",
      },
      country: country,
    });

    if (!res.ok) throw new Error("Failed to fetch banners");
    const data = await res.json();

    if (data?.status === "SUCCESS" && Array.isArray(data.result)) {
      return data.result;
    }
    return [];
  } catch (error) {
    console.error("Error fetching banner images:", error);
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
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);

  const bannerImages = await getBannerImages(state, isMobile, country);

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
