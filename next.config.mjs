/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Necessário para o Dockerfile otimizado
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
