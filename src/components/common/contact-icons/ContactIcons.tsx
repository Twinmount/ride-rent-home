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

  const handleWhatsAppClick = async () => {
    if (!whatsappUrl) return; // Do nothing if WhatsApp is unavailable
    setLoading(true);
    await sendQuery(vehicleId, "WHATSAPP");
    setLoading(false);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleEmailClick = async () => {
    if (!email) return; // Do nothing if email is unavailable
    setLoading(true);
    await sendQuery(vehicleId, "EMAIL");
    setLoading(false);
    window.location.href = `mailto:${email}`;
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

      {/* Email Icon */}
      <div
        aria-label="email"
        onClick={handleEmailClick}
        className={`icon mail ${
          loading || !email ? "disabled" : "cursor-pointer"
        }`}
        style={loading ? { cursor: "wait" } : {}}
      >
        <ImMail className="icon mail" />
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
