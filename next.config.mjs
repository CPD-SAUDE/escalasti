/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Necessário para Docker
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
