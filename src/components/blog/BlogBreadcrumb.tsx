"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BlogBreadcrumb({
  title,
  blogCategory,
}: {
  title: string;
  blogCategory: string;
}) {
  return (
    <Breadcrumb className="mx-auto my-4 w-fit max-w-[92%]">
      <BreadcrumbList className="">
        <BreadcrumbItem className="w-fit">
          <BreadcrumbLink
            className="text-base font-semibold text-yellow hover:text-yellow hover:underline lg:text-lg"
            href="/blog"
            aria-label="Go to home"
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        <BreadcrumbItem className="w-fit">
          <BreadcrumbLink
            className="text-base font-semibold capitalize text-yellow hover:text-yellow hover:underline lg:text-lg"
            href={`/?page=1&tag=${blogCategory}`}
            aria-label="Go to home"
          >
            {blogCategory}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        <BreadcrumbItem className="w-fit">
          <BreadcrumbPage className="line-clamp-1 text-base font-semibold lg:text-lg">
            {title}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
