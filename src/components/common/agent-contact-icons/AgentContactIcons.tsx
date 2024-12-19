"use client";
import "./AgentContactIcons.scss";
import React from "react";
import { FaWhatsappSquare } from "react-icons/fa";
import { ImMail } from "react-icons/im";
import Phone from "../phone/Phone";

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
      className={`agent-card-contact-icons ${
        isDisabled ? "container-disabled" : ""
      }`}
    >
      {/* WhatsApp Icon */}
      <div
        aria-label="whatsapp"
        onClick={handleWhatsAppClick}
        className={`icon whatsapp ${
          !whatsappUrl ? "disabled" : "cursor-pointer"
        }`}
      >
        <FaWhatsappSquare className="icon whatsapp" />
      </div>

      {/* Email Icon */}
      <div
        aria-label="email"
        onClick={handleEmailClick}
        className={`icon mail ${!email ? "disabled" : "cursor-pointer"}`}
      >
        <ImMail className="icon mail" />
      </div>

      {/* Phone Icon */}
      <Phone phoneNumber={phoneNumber} />
    </div>
  );
};

export default AgentContactIcons;
