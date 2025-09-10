/**
 * Escapes XML special characters
 */
export function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

/**
 * Generates XML sitemap string from entries
 */
export function generateSitemapXML(entries: any[]): string {
  const xmlEntries = entries
    .map((entry) => {
      const images =
        entry.images
          ?.map(
            (img: string) => `
            <image:image>
              <image:loc>${escapeXml(img)}</image:loc>
            </image:image>`
          )
          .join("") || "";

      return `
        <url>
          <loc>${escapeXml(entry.url)}</loc>
          <lastmod>${entry.lastModified}</lastmod>
          <changefreq>${entry.changeFrequency}</changefreq>
          <priority>${entry.priority}</priority>${images}
        </url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${xmlEntries}
</urlset>`;
}
