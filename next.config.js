/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  // Turbopack ko explicitly enable kar do (safe)
  turbopack: {},
};

module.exports = nextConfig;