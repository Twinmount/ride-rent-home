import FAQ from "@/components/common/FAQ/FAQ";
import { PageProps } from "@/types";
import { convertToLabel } from "@/helpers";
import HeadingBanner from "@/components/common/heading-banner/HeadingBanner";

export async function generateMetadata(props: PageProps) {
  const params = await props.params;

  const { state, country } = params;

  const canonicalUrl = `https://ride.rent/${country}/faq/${state}`;
  const title = `Frequently Asked Questions - Ride Rent - ${convertToLabel(state)}`;
  const description = `Find answers to frequently asked questions about renting vehicles in ${convertToLabel(state)}. Learn more about vehicle rentals, services, and policies.`;

  return {
    title,
    description,
    keywords: `FAQ, frequently asked questions, vehicle rental in ${convertToLabel(state)}, Ride Rent`,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function FAQPage(props: PageProps) {
  const params = await props.params;

  const { state, country } = params;

  return (
    <section>
      <HeadingBanner heading="Frequently Asked Questions" />

      <FAQ stateValue={state || "dubai"} country={country} />
    </section>
  );
}
