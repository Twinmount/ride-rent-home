import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/**", // This allows any subpath within the specified base path
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**", // This allows any subpath within the specified base path
      },
    ],
  },
  sassOptions: {
    includePaths: [path.join(process.cwd(), "src/styles")],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/ae/dubai",
        permanent: true,
      },

      {
        source: "/:country(ae)",
        destination: "/:country/dubai",
        permanent: true,
      },
      {
        source: "/:country(in)",
        destination: "/in/kollam",
        permanent: true,
      },
      {
        source:
          "/:country/:state(dubai|sharjah|abu-dhabi|al-ain|fujairah|ras-al-khaima|ajman|umm-al-quwain)",
        destination: "/:country/:state/cars",
        permanent: true,
      },
      {
        source: "/in/:state",
        destination: "/in/:state/cars",
        permanent: true,
      },
      {
        source: "/:country/faq",
        destination: "/:country/faq/dubai",
        permanent: true,
      },
      {
        source: "/state/:path*",
        destination: "/country/state/:path*",
        permanent: true,
      },
      {
        source: "/profile/:path*",
        destination: "/ae/profile/:path*",
        permanent: true,
      },
      {
        source:
          "/:state(dubai|sharjah|abu-dhabi|al-ain|fujairah|ras-al-khaima|ajman|umm-al-quwain)/:path*",
        destination: "/ae/:state/:path*",
        permanent: true,
      },
      //  { source: "/about-us", destination: "/about-us", permanent: true },
      // { source: "/privacy-policy", destination: "/privacy-policy", permanent: true },
      // { source: "/terms-condition", destination: "/terms-condition", permanent: true },
      // { source: "/sitemap-in.xml", destination: "/sitemap-in.xml", permanent: true },
      // { source: "/sitemap-ae.xml", destination: "/sitemap-ae.xml", permanent: true },
    ];
  },
};

export default nextConfig;
