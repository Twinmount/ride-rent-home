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
    <Breadcrumb className="w-fit  max-w-[92%]  mx-auto my-4">
      <BreadcrumbList className="">
        <BreadcrumbItem className="w-fit">
          <BreadcrumbLink
            className="font-semibold text-base  lg:text-lg text-yellow hover:underline hover:text-yellow"
            href="/"
            aria-label="Go to home"
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        <BreadcrumbItem className="w-fit">
          <BreadcrumbLink
            className="font-semibold capitalize text-base  lg:text-lg hover:underline text-yellow hover:text-yellow"
            href={`/?page=1&tag=${blogCategory}`}
            aria-label="Go to home"
          >
            {blogCategory}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        <BreadcrumbItem className="w-fit">
          <BreadcrumbPage className="line-clamp-1 text-base  lg:text-lg font-semibold  ">
            {title}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
