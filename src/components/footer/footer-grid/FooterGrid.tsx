import React, { Suspense } from "react";
import MotionDiv from "../../general/framer-motion/MotionDiv";
import FooterLocations from "./FooterLocations";
import FooterVehicleCategories from "./FooterVehicleCategories";
import FooterQuickLinks from "./FooterQuickLinks";
import { CompanyLinks } from "./CompanyLinks";

const FooterGrid = () => {
  return (
    <MotionDiv className="mx-auto grid w-fit grid-cols-2 gap-4 pb-8 md:grid-cols-4">
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
