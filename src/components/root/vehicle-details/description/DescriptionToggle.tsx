"use client";

import React, { useState } from "react";

const DescriptionToggle = ({ isExpanded }: { isExpanded: boolean }) => {
  const [expanded, setExpanded] = useState(isExpanded);

  const handleToggle = () => {
    if (expanded) {
      // Scroll to the description-content div when collapsing
      const descriptionContent = document.getElementById("description-content");
      descriptionContent?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setExpanded(!expanded);
  };

  return (
    <label
      htmlFor="toggle-description"
      className="bg-orange p-1 rounded-2xl text-white mb-2 px-4 shadow-sm hover:shadow-lg transition-transform ease-in-out cursor-pointer flex items-center gap-x-2"
      onClick={handleToggle}
    >
      {expanded ? "Show Less" : "Show More"}
    </label>
  );
};

export default DescriptionToggle;
