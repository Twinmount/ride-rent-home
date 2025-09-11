// app/components/InfoDescriptionClient.tsx
"use client";

import { useState } from "react";

type Props = {
  description: string;
};

export default function InfoDescription({ description }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <p
        className={`text-xs text-text-tertiary lg:text-sm transition-all duration-200 ${
          expanded ? "line-clamp-none" : "line-clamp-2"
        } lg:line-clamp-none`}
      >
        {description}
      </p>

      {/* Show toggle only on mobile (hidden on lg and up) */}
      <button
        onClick={() => setExpanded((s) => !s)}
        className="mt-1 w-fit text-xs font-medium text-yellow lg:hidden"
      >
        {expanded ? "Less" : "More"}
      </button>
    </>
  );
}
