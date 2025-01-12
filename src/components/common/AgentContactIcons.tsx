"use client";

import React from "react";
import { FaWhatsappSquare } from "react-icons/fa";
import { ImMail } from "react-icons/im";
import Phone from "./contact-icons/Phone";

interface AgentContactIconsProps {
  whatsappUrl: string | null;
  email: string | null;
  phoneNumber: string | null;
}

const AgentContactIcons: React.FC<AgentContactIconsProps> = ({
  whatsappUrl,
  email,
  phoneNumber,
}) => {
  const handleWhatsAppClick = () => {
    if (!whatsappUrl) return;

    // Open WhatsApp in a new tab immediately
    const newTab = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    const gtag_report_conversion = (url: string | null) => {
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        const callback = () => {
          if (url && !newTab) {
            // If the new tab wasn’t successfully opened earlier, fallback
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
        if (url && !newTab) {
          // Fallback to open WhatsApp in a new tab
          window.open(url, "_blank", "noopener,noreferrer");
        }
      }
    };

    gtag_report_conversion(whatsappUrl);
  };

  const handleEmailClick = () => {
    if (!email) return;

    // Open Email in a new tab immediately
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
          // Fallback to open Email in a new tab
          window.open(url, "_blank", "noopener,noreferrer");
        }
      }
    };

    gtag_report_conversion(emailLink);
  };

  const isDisabled = !whatsappUrl || !email || !phoneNumber;

  return (
    <div
      className={`flex w-fit items-center gap-2 ${isDisabled ? "container-disabled" : ""}`}
    >
      {/* WhatsApp Icon */}
      <button
        aria-label="company whatsapp"
        onClick={handleWhatsAppClick}
        className={` ${
          !whatsappUrl
            ? "cursor-not-allowed opacity-30 blur-sm"
            : "cursor-pointer"
        }`}
      >
        <FaWhatsappSquare className="h-10 w-10 text-green-500" />
      </button>

      {/* Email Icon */}
      <button
        aria-label="company email"
        onClick={handleEmailClick}
        className={` ${!email ? "cursor-not-allowed opacity-30 blur-sm" : "cursor-pointer"}`}
      >
        <ImMail className="h-9 w-9 text-blue-500" />
      </button>

      {/* Phone Icon */}
      <Phone phoneNumber={phoneNumber} />
    </div>
  );
};

export default AgentContactIcons;
