type JsonLdProps = {
  jsonLdData: object | null;
  id?: string;
};

export default function JsonLd({
  jsonLdData,
}: JsonLdProps) {
  if (!jsonLdData) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLdData),
      }}
    />
  );
}
