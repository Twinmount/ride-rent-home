import { RemoveUrlQueryParams } from "@/types";
import qs from "query-string";

// to form url params key/value
export function formBlogUrlQuery({
  params,
  updates,
}: {
  params: string;
  updates: Record<string, string | number | undefined>;
}) {
  const currentUrl = qs.parse(params);

  // Update multiple keys in the query object
  Object.keys(updates).forEach((key) => {
    const value = updates[key];
    if (value === undefined || value === null) {
      // If the value is undefined or null, remove the key from the query
      delete currentUrl[key];
    } else {
      // Otherwise, convert the value to a string and update the query
      currentUrl[key] = String(value);
    }
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
}

// to remove url params key
export function removeBlogKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
}

// generate blog url
export function generateBlogHref(
  country: string,
  title: string,
  blogId: string,
): string {
  let cleanTitle = title
    .trim() // Remove leading/trailing spaces
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s&!-]/g, "") // Allow letters, numbers, spaces, &, hyphens, and !
    .replace(/\s*-\s*/g, "-") // Replace spaces around hyphens with a single hyphen
    .replace(/\s+/g, "-") // Replace remaining spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple consecutive hyphens with a single one
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  // final url to blog details page
  return `/${country}/blog/${cleanTitle}/${blogId}`;
}
