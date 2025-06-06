"use client";
import { ENV } from "@/config/env";
import { useEffect } from "react";

export default function BlogViewTracker({ blogId }: { blogId: string }) {
  useEffect(() => {
    const key = `viewed-${blogId}`;
    const lastViewed = localStorage.getItem(key);
    const now = Date.now();

    const url = `${ENV.API_URL}/blogs/view?blogId=${blogId}`;

    // Only send the view request if 5 minutes (300000 ms) have passed
    if (!lastViewed || now - parseInt(lastViewed) > 300000) {
      fetch(url, {
        method: "GET",
      });
      localStorage.setItem(key, now.toString());
    }
  }, [blogId]);

  return null;
}
