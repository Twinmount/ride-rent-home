import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  images: {
    unoptimized: true, // 🚨 CRITICAL FIX
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },

  sassOptions: {
    includePaths: [path.join(process.cwd(), "src/styles")],
  },

  async redirects() {
    return [
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
