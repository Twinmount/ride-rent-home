"use client";

import { fetchBlogsData } from "@/app/(root)/[country]/blog/actions";
import { JSX, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

type LoadMoreBlogsProps = {
  selectedTag: string;
  country: string;
};

export default function LoadMoreBlogs({
  selectedTag,
  country,
}: LoadMoreBlogsProps) {
  const { ref, inView } = useInView();
  const [data, setData] = useState<JSX.Element[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(2);

  useEffect(() => {
    if (inView && hasMore) {
      fetchBlogsData({ page, selectedTag, country }).then((response) => {
        if (!response.hasMore) {
          setHasMore(false);
        } else {
          setData((prev) => [...prev, ...response.blogs]);
          setPage((prevPage) => prevPage + 1);
        }
      });
    }
  }, [inView, page, hasMore]);

  // Reset when selected tag changes
  useEffect(() => {
    setData([]); // Clear old blogs
    setPage(2); // Reset to page 2
    setHasMore(true); // Enable infinite loading again
  }, [selectedTag]);

  return (
    <>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data}
      </div>

      <div>
        {hasMore ? (
          <div ref={ref} className="flex-center h-12">
            Loading more...
          </div>
        ) : (
          <div className="flex-center h-12">You&apos;ve reached the end!</div>
        )}
      </div>
    </>
  );
}
