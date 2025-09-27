import SafeImage from "@/components/common/SafeImage";

import Link from "next/link";
import { generateBlogHref } from "@/helpers/blog-helpers";

import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import { BlogType } from "@/types/blog.types";

type BlogCardProps = {
  blog: BlogType;
  country: string;
};

export default function BlogCard({ blog, country }: BlogCardProps) {
  const href = generateBlogHref(country, blog.blogTitle, blog.blogId);

  return (
    <MotionDiv className="group mx-auto h-full min-w-[265px] max-w-sm transform overflow-hidden rounded-xl bg-white shadow-lg transition duration-300 hover:scale-[1.02] hover:shadow-xl">
      <Link href={href} className="flex h-full flex-col">
        <div className="overflow-hidden">
          {/* Image with zoom effect on card hover */}
          <SafeImage
            width={400}
            height={300}
            src={blog.blogImage ?? "/assets/bg/blur.jpg"}
            alt={`${blog.blogTitle.slice(0, 15)}${
              blog.blogTitle.length > 15 ? "..." : ""
            }`}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="h-48 p-4">
          <div className="text-sm uppercase tracking-wide text-gray-600">
            <span className="rounded-md bg-slate-100 px-2 text-yellow shadow-md">
              {blog.blogCategory}
            </span>{" "}
            &middot;{" "}
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <h3 className="mt-2 line-clamp-2 text-lg font-semibold">
            {blog.blogTitle}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm text-gray-600">
            {blog.blogDescription}
          </p>
        </div>
      </Link>
    </MotionDiv>
  );
}
