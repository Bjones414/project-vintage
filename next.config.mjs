/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/search/:listingId',
        destination: '/analyze/:listingId',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
