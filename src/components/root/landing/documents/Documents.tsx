"use client";

import MotionSection from "@/components/general/framer-motion/MotionSection";
import DocumentsRequired from "./DocumentsRequired";
import { convertToLabel, singularizeValue } from "@/helpers";
import { StateCategoryProps } from "@/types";
import SafeImage from "@/components/common/SafeImage";
import { SectionHeading } from "@/components/common/SectionHeading";
import { getHomePageDocuments } from "@/helpers/homepage-content.helper";

const Documents = ({ country, state, category }: StateCategoryProps) => {
  const formattedCategory = singularizeValue(convertToLabel(category));
  const { title, description } = getHomePageDocuments({
    country,
    state,
    category,
  });

  return (
    <MotionSection className="no-global-padding relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-1">
      <div className="global-padding mx-auto w-full pb-4 lg:flex">
        {/* Background gradient */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(220.28deg, rgba(255, 255, 255, 0) 45%, rgba(249, 168, 37, 0.5) 120%)",
          }}
        />

        {/* Desktop-only illustration */}
        <div className="relative z-10 hidden pt-32 lg:block lg:w-[45%] lg:pl-6">
          <div className="relative flex h-full items-center justify-center">
            <SafeImage
              src="/assets/img/home-images/document-section-img.png"
              alt="Document requirements illustration"
              width={600}
              height={500}
              className="object-contain"
              loading="lazy" // Below fold - always lazy
              quality={75} // Good for illustrations
              sizes="600px"
            />
          </div>
        </div>

        {/* Content section */}
        <div className="relative z-10 space-y-4 sm:space-y-6 lg:w-[55%] lg:space-y-8 lg:py-8">
          <div className="space-y-4 sm:space-y-6">
            <SectionHeading title={title} align="left" />

            <div className="space-y-3 pr-1 text-justify text-xs font-normal text-text-tertiary sm:text-sm lg:space-y-4 lg:text-base">
              {description.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          <DocumentsRequired country={country} category={formattedCategory} />
        </div>
      </div>
    </MotionSection>
  );
};

export default Documents;
