import React, { Suspense } from "react";
import MotionDiv from "../../general/framer-motion/MotionDiv";
import FooterLocations from "./FooterLocations";
import FooterVehicleCategories from "./FooterVehicleCategories";
import FooterQuickLinks from "./FooterQuickLinks";
import { CompanyLinks } from "./CompanyLinks";

const FooterGrid = () => {
  return (
    <MotionDiv className="mx-auto hidden w-full grid-cols-2 gap-4 pb-8 md:grid md:max-w-[90%] md:grid-cols-4 lg:grid lg:max-w-[80%] xl:max-w-[70%]">
      <FooterLocations />

      <Suspense fallback={<div>Loading..</div>}>
        <CompanyLinks />
      </Suspense>

      <FooterVehicleCategories />

      <Suspense fallback={<div>Loading..</div>}>
        <FooterQuickLinks />
      </Suspense>
    </MotionDiv>
  );
};

export default FooterGrid;