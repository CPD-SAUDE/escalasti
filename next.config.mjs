/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Habilita a saída standalone para Docker
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
        hostname: 'blob.v0.dev',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
