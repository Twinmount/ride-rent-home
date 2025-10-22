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
      // {
      //   source: "/",
      //   destination: "/ae/dubai",
      //   permanent: true,
      // },
      {
        source: "/ae/faq",
        destination: "/ae/faq/dubai",
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
    ];
  },
};

export default nextConfig;
