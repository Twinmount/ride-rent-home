import Script from "next/script";

type JsonLdProps = {
  jsonLdData: object | null;
  id?: string;
};

/**
 * Renders a JSON-LD script tag for embedding structured data into a webpage.
 *
 * @param {object} jsonLdData - The JSON-LD data to be embedded.
 * @param {string} [id="json-ld"] - The id attribute for the script tag.
 */

export default function JsonLd({ jsonLdData, id = "json-ld" }: JsonLdProps) {
  if (!jsonLdData) {
    return null;
  }

  return (
    <Script
      id={id || "json-ld-default"}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLdData, null, 2),
      }}
    />
  );
}
