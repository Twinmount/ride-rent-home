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
    <MotionSection className="no-global-padding relative overflow-hidden bg-gradient-to-b from-[#f8f6f6] to-white pt-1">
      <div className="global-padding mx-auto w-full pb-4 lg:flex">
        {/* Yellow gradient overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 top-0 z-0"
          style={{
            background:
              "linear-gradient(220.28deg, rgba(255, 255, 255, 0) 45%, rgba(249, 168, 37, 0.5) 120%)",
          }}
        />

        {/* ✅ ONLY ONE image section - desktop only */}
        <div className="z-1 relative hidden pt-[8rem] lg:block lg:h-full lg:w-[45%] lg:overflow-hidden lg:pl-[1.5rem]">
          <div className="relative flex h-full items-center justify-center lg:justify-between">
            <div className="relative">
              <SafeImage
                src="/assets/img/home-images/document-section-img.png"
                alt="Document requirements illustration"
                width={600}
                height={500}
                className="relative max-w-none object-contain"
                loading="lazy"
                quality={80}
                sizes="600px"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjZjNmNGY2Ii8+Cjwvc3ZnPgo="
              />
            </div>
          </div>
        </div>

        {/* Right content section */}
        <div className="z-1 relative right-0 space-y-[1rem] pb-0 sm:space-y-[1.5rem] sm:text-[0.17rem] lg:w-[55%] lg:space-y-[2rem] lg:py-[2rem] lg:pb-0 lg:text-[2.2rem]">
          <div className="space-y-[1rem] sm:space-y-[1.5rem]">
            <SectionHeading title={title} align="left" />

            <div className="space-y-[0.75rem] pr-1 text-justify font-poppins text-[0.75rem] font-normal leading-[130%] tracking-[0%] text-text-tertiary sm:text-[0.875rem] sm:leading-[125%] lg:space-y-[1rem] lg:text-[0.9375rem] lg:leading-[120%]">
              {description.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          <DocumentsRequired category={formattedCategory} />
        </div>
      </div>
    </MotionSection>
  );
};

export default Documents;
