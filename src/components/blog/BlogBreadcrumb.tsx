"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export function BlogBreadcrumb({
  title,
  blogCategory,
  country,
}: {
  title: string;
  blogCategory: string;
  country: string;
}) {
  return (
    <Breadcrumb className="mx-auto my-4 w-fit max-w-[92%]">
      <BreadcrumbList className="">
        <BreadcrumbItem className="w-fit">
          <BreadcrumbLink
            className="text-base font-semibold text-yellow hover:text-yellow hover:underline lg:text-lg"
            aria-label="Go to home"
            asChild
          >
            <Link href={`/${country}/blog`}>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        <BreadcrumbItem className="w-fit">
          <BreadcrumbLink
            className="text-base font-semibold capitalize text-yellow hover:text-yellow hover:underline lg:text-lg"
            aria-label="Go to home"
            asChild
          >
            <Link href={`/${country}/blog?tag=${blogCategory}`}>
              {blogCategory}
            </Link>
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
