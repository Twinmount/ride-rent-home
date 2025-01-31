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
      className="mb-2 flex cursor-pointer items-center gap-x-2 rounded-2xl bg-orange p-1 px-4 text-white shadow-sm transition-transform ease-in-out hover:shadow-lg"
      onClick={handleToggle}
    >
      {expanded ? "Show Less" : "Show More"}
    </label>
  );
};

export default DescriptionToggle;
