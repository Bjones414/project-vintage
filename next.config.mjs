/** @type {import('next').NextConfig} */
const nextConfig = {
  // Include the defect catalog docs in Vercel's file tracing so they're
  // available at runtime in serverless functions.
  outputFileTracingIncludes: {
    '/**': ['./docs/**/*'],
  },
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
