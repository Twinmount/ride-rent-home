"use client";
import { sendQuery } from "@/lib/api/general-api";
import React, { useState } from "react";
import { FaWhatsappSquare } from "react-icons/fa";
import Phone from "./Phone";

interface ContactIconsProps {
  vehicleId: string;
  whatsappUrl: string | null;
  email: string | null;
  phoneNumber: string | null;
}

const ContactIcons: React.FC<ContactIconsProps> = ({
  vehicleId,
  whatsappUrl,
  email,
  phoneNumber,
}) => {
  const [loading, setLoading] = useState(false);

  // whatsapp click handler with google script
  const handleWhatsAppClick = async () => {
    if (!whatsappUrl) return; // Do nothing if WhatsApp is unavailable

    // Open the WhatsApp link immediately
    const newTab = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    const gtag_report_conversion = (url: string | null) => {
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        const callback = () => {
          if (url && !newTab) {
            // If the tab wasn't opened earlier (e.g., popup blocker), open it now
            window.open(url, "_blank", "noopener,noreferrer");
          }
        };

        window.gtag("event", "conversion", {
          send_to: "AW-11504082547/EsCKCMuEyvkZEPO8ye0q",
          value: 1.0,
          currency: "INR",
          event_callback: callback,
        });
      } else {
        console.warn("gtag is not defined");
        if (!newTab && url) {
          // Fallback if gtag is not defined and the tab wasn't opened
          window.open(url, "_blank", "noopener,noreferrer");
        }
      }
    };

    // Optional: Trigger server-side logging for WhatsApp click
    setLoading(true);
    await sendQuery(vehicleId, "WHATSAPP");
    setLoading(false);

    // Trigger Google Ads conversion tracking
    gtag_report_conversion(whatsappUrl);
  };

  const handlePhoneClick = async () => {
    if (!phoneNumber) return; // Do nothing if phone is unavailable
    setLoading(true);
    await sendQuery(vehicleId, "OTHER");
    setLoading(false);
  };
  const isDisabled = !whatsappUrl || !email || !phoneNumber;

  return (
    <div
      className={`flex w-fit gap-2 ${isDisabled ? "container-disabled" : ""}`}
    >
      {/* WhatsApp Icon */}
      <div
        aria-label="whatsapp"
        onClick={handleWhatsAppClick}
        className={` ${
          loading || !whatsappUrl
            ? "cursor-not-allowed opacity-30 blur-sm"
            : "cursor-pointer"
        }`}
        style={loading ? { cursor: "wait" } : {}}
      >
        <FaWhatsappSquare className="h-10 w-10 text-green-500" />
      </div>

      {/* Phone Icon */}
      <Phone
        phoneNumber={phoneNumber}
        onClick={handlePhoneClick}
        loading={loading}
      />
    </div>
  );
};

export default ContactIcons;
