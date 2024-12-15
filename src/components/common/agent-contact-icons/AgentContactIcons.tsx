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
  const handleWhatsAppClick = async () => {
    if (!whatsappUrl) return;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleEmailClick = async () => {
    if (!email) return;
    window.location.href = `mailto:${email}`;
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
