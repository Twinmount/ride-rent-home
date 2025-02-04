import React, { Suspense } from "react";
import MotionDiv from "../../general/framer-motion/MotionDiv";
import FooterLocations from "./FooterLocations";
import FooterVehicleCategories from "./FooterVehicleCategories";
import FooterQuickLinks from "./FooterQuickLinks";
import { CompanyLinks } from "./CompanyLinks";

const FooterGrid = () => {
  return (
    <MotionDiv className="mx-auto grid w-full grid-cols-2 gap-4 pb-8 md:max-w-[90%] md:grid-cols-4 lg:max-w-[80%] xl:max-w-[70%]">
      <FooterLocations />

      {/* links for the company */}
      <Suspense fallback={<div>Loading..</div>}>
        <CompanyLinks />
      </Suspense>

      {/* links related toW vehicles */}
      <FooterVehicleCategories />

      {/* quick links */}
      <Suspense fallback={<div>Loading..</div>}>
        <FooterQuickLinks />
      </Suspense>
    </MotionDiv>
  );
};

export default FooterGrid;
