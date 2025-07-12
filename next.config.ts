/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  typescript: {
    // !! WARN !!
    // This setting is required for production deployment
    // Remove this when you've fixed all the TS errors
    ignoreBuildErrors: true,
  },
};

export default config;
