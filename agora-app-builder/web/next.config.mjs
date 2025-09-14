/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async redirects() {
    return [
      // Redirect www → apex
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ezchat.cam" }],
        destination: "https://ezchat.cam/:path*",
        permanent: true,
      },
      // (Optional) Redirect your vercel.app domain to apex
      {
        source: "/:path*",
        has: [{ type: "host", value: "agora-app-builder-blush.vercel.app" }],
        destination: "https://ezchat.cam/:path*",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
