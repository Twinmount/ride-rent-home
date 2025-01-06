"use client";
import "./ContactIcons.scss";
import { sendQuery } from "@/lib/api/general-api";
import React, { useState } from "react";
import { FaWhatsappSquare } from "react-icons/fa";
import { ImMail } from "react-icons/im";
import Phone from "../phone/Phone";

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

  // email click handler with google script
  const handleEmailClick = async () => {
    if (!email) return; // Do nothing if email is unavailable

    // Open the email link in a new tab immediately
    const emailLink = `mailto:${email}`;
    const newTab = window.open(emailLink, "_blank", "noopener,noreferrer");

    const gtag_report_conversion = (url: string | null) => {
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        const callback = () => {
          if (url && !newTab) {
            // If the new tab wasn’t successfully opened earlier, fallback
            window.open(url, "_blank", "noopener,noreferrer");
          }
        };

        window.gtag("event", "conversion", {
          send_to: "AW-11504082547/LqEKCJfvv_kZEPO8ye0q",
          value: 1.0,
          currency: "INR",
          event_callback: callback,
        });
      } else {
        console.warn("gtag is not defined");
        if (url && !newTab) {
          // Fallback to open email in a new tab
          window.open(url, "_blank", "noopener,noreferrer");
        }
      }
    };

    // Optional: Trigger server-side logging for email click
    setLoading(true);
    await sendQuery(vehicleId, "EMAIL");
    setLoading(false);

    // Trigger Google Ads conversion tracking
    gtag_report_conversion(emailLink);
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
      className={`card-contact-icons ${isDisabled ? "container-disabled" : ""}`}
    >
      {/* WhatsApp Icon */}
      <div
        aria-label="whatsapp"
        onClick={handleWhatsAppClick}
        className={`icon whatsapp ${
          loading || !whatsappUrl ? "disabled" : "cursor-pointer"
        }`}
        style={loading ? { cursor: "wait" } : {}}
      >
        <FaWhatsappSquare className="icon whatsapp" />
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
