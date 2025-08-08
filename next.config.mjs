/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Necessário para o Docker build otimizado
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
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'blob.v0.dev',
      },
    ],
    unoptimized: true,
  },
}

export default nextConfig
