import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: "/:path*", has: [{ type: "host", value: "www.ezchat.cam" }], destination: "https://ezchat.cam/:path*", permanent: true }];
  },
};
export default nextConfig;
