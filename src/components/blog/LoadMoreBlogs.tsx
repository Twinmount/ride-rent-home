"use client";

import { fetchBlogsDataRaw } from "@/app/(root)/[country]/blog/actions";
import BlogCard from "@/components/card/blog/BlogCard";
import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";

type LoadMoreBlogsProps = {
  selectedTag: string;
  country: string;
};

export default function LoadMoreBlogs({
  selectedTag,
  country,
}: LoadMoreBlogsProps) {
  const { ref, inView } = useInView({ threshold: 0 });

  const [blogs, setBlogs] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const pageRef = useRef(2);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (loadingRef.current || !hasMore || !inView) {
      console.log("❌ SKIPPING - Guard failed");
      return;
    }

    const loadMore = async () => {
      loadingRef.current = true;
      setIsLoading(true);

      try {
        const response = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: pageRef.current,
            selectedTag,
            country,
          }),
        });

        const data = await response.json();

        if (data && data.blogs && data.blogs.length > 0) {
          setBlogs((prev) => [...prev, ...data.blogs]);
          setHasMore(data.hasMore);
          pageRef.current += 1;
        } else {
          setHasMore(false);
        }
      } catch (error) {
        setHasMore(false);
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    };

    loadMore();
  }, [inView, hasMore, selectedTag, country]);

  useEffect(() => {
    setBlogs([]);
    pageRef.current = 2;
    setHasMore(true);
    setIsLoading(false);
    loadingRef.current = false;
  }, [selectedTag]);

  return (
    <>
      {blogs.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {blogs.map((blog) => (
            <BlogCard key={blog.blogId} blog={blog} country={country} />
          ))}
        </div>
      )}

      <div>
        {hasMore ? (
          <div ref={ref} className="flex-center h-12">
            {isLoading ? "Loading more..." : "Load more"}
          </div>
        ) : (
          blogs.length > 0 && (
            <div className="flex-center h-12">You&apos;ve reached the end!</div>
          )
        )}
      </div>
    </>
  );
}
