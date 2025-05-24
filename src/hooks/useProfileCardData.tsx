"use client";

import { useMemo } from "react";
import {
  generateCompanyProfilePageLink,
  generateVehicleDetailsUrl,
  generateWhatsappUrl,
  getFormattedPhoneNumber,
} from "@/helpers";
import { ProfileCardDataType } from "@/types/vehicle-details-types";

/**
 * Given a ProfileCardDataType, this hook will create a new object with the
 * following properties:
 * - formattedPhoneNumber: a string representing the phone number of the
 *   company, formatted according to the country code provided in the
 *   contactDetails object.
 * - vehicleDetailsPageLink: a string representing a link to the vehicle
 *   details page for the vehicle specified in the vehicleData object.
 * - whatsappUrl: a string representing a link to WhatsApp with a pre-filled
 *   message asking the agent about the specified vehicle.
 * - companyProfilePageLink: a string representing a link to the company
 *   profile page for the company specified in the company object.
 * - isCompanyValid: a boolean indicating whether the company object is valid
 *   (i.e. it has a name and a profile).
 * - rentalDetails: the rentalDetails object from the input profileData.
 * - isLease: the isLease boolean from the input profileData.
 * - securityDeposit: the securityDeposit object from the input profileData.
 * - vehicleId: the vehicleId string from the input profileData.
 * - vehicleTitle: the vehicleTitle string from the input profileData.
 */
const useProfileData = (profileData: ProfileCardDataType, country: string) => {
  const {
    company,
    rentalDetails,
    vehicleId,
    vehicleCode,
    isLease,
    vehicleData,
    securityDeposit,
    vehicleTitle,
  } = profileData;

  const contactDetails = company?.contactDetails;

  // formatted phone number
  const formattedPhoneNumber = useMemo(() => {
    return getFormattedPhoneNumber(
      contactDetails?.countryCode,
      contactDetails?.phone,
    );
  }, [contactDetails?.countryCode, contactDetails?.phone]);

  // dynamically generating vehicle details page link
  const vehicleDetailsPageLink = useMemo(() => {
    return generateVehicleDetailsUrl({
      vehicleTitle,
      state: vehicleData?.state,
      vehicleCategory: vehicleData?.category,
      vehicleCode,
      country,
    });
  }, [vehicleTitle, vehicleData, vehicleCode]);

  // whatsapp url with attached message
  const whatsappUrl = useMemo(() => {
    return generateWhatsappUrl({
      whatsappPhone: contactDetails?.whatsappPhone,
      whatsappCountryCode: contactDetails?.whatsappCountryCode,
      model: vehicleData?.model,
      vehicleDetailsPageLink,
    });
  }, [contactDetails, vehicleData, vehicleDetailsPageLink]);

  // company portfolio page dynamic link
  const companyProfilePageLink = useMemo(() => {
    return generateCompanyProfilePageLink(
      company.companyName,
      company.companyId,
      country,
    );
  }, [company.companyName, company.companyId]);

  // company disabled validity check
  const isCompanyValid = useMemo(() => {
    return !!company?.companyName && !!company?.companyProfile;
  }, [company]);

  return {
    formattedPhoneNumber,
    vehicleDetailsPageLink,
    whatsappUrl,
    companyProfilePageLink,
    isCompanyValid,
    rentalDetails,
    isLease,
    securityDeposit,
    vehicleId,
    vehicleTitle,
    company,
  };
};

export default useProfileData;
