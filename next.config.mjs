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
          '/:state(dubai|sharjah|abudhabi|alain|fujairah|rasalkhaima|ajman|ummalquwain)',
        destination: '/:state/cars',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
