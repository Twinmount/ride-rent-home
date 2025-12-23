import { isValidCountryCode } from "@/config/country-config";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export type LayoutProps = {
  params: Promise<{ country: string }>;
  children: React.ReactNode;
};

/**
 * This layout wraps all pages in the `pages/(root)/[country]` directory.
 * If the country is not valid, it will return a 404 response.
 * If the current path starts with "/blog" along with invalid country, it will redirect to the same path but with "ae" prefixed.
 */
export default async function Layout({ children, params }: LayoutProps) {
  const { country } = await params;

  const headerList = await headers();
  const currentPath = headerList.get("x-current-path") || "";

  if (!isValidCountryCode(country)) {
    if (
      currentPath.startsWith("/blog") ||
      currentPath.startsWith("/blog/") ||
      country === "blog"
    ) {
      console.log("redirecting to blog page with country");

      // Redirect to same path but with "ae" prefixed
      redirect(`/ae${currentPath}`);
    } else {
      console.warn(
        "triggering not found from country layout because of invalid country"
      );
      notFound();
    }
  }

  return children;
}
