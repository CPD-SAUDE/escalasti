/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Necessário para o Dockerfile de produção
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
