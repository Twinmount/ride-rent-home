import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**', // This allows any subpath within the specified base path
      },
    ],
  },
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src/styles')],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dubai',
        permanent: true,
      },
      {
        source:
          '/:state(dubai|sharjah|abu-dhabi|al-ain|fujairah|ras-al-khaima|ajman|umm-al-quwain)',
        destination: '/:state/cars',
        permanent: true,
      },
      {
        source: '/faq',
        destination: '/faq/dubai',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
