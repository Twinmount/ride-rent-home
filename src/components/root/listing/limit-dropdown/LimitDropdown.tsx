"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/helpers";
import { useEffect } from "react";

const LimitDropdown = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  // Get the current limit from URL parameters or default to 6
  const currentLimit = searchParams.get("limit") || "6";

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = event.target.value;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "limit",
      value: newLimit,
    });

    router.push(newUrl, { scroll: false });
  };

  // Set initial state to URL on component mount
  useEffect(() => {
    const initialLimit = searchParams.get("limit") || "6";
    if (!searchParams.get("limit")) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "limit",
        value: initialLimit,
      });
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, router]);

  return (
    <div className="dropdown">
      Show :&nbsp;
      <select value={currentLimit} onChange={handleLimitChange}>
        <option value="6">6</option>
        <option value="12">12</option>
      </select>
    </div>
  );
};

export default LimitDropdown;
