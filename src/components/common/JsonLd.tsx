import Script from "next/script";

type JsonLdProps = {
  jsonLdData: object | null;
  id?: string;
};

/**
 * Renders a JSON-LD script tag inside the <head> of the page.
 *
 * @param {object} jsonLdData - The JSON-LD data to be embedded.
 * @param {string} [id="json-ld"] - The id attribute for the script tag.
 */

export default function JsonLd({
  jsonLdData,
  id = "json-ld-default",
}: JsonLdProps) {
  if (!jsonLdData) {
    return null;
  }

  return (
    <Script
      id={id}
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLdData, null, 2),
      }}
    />
  );
}
