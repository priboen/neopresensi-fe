import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost"],
  },
  redirects: async () => [
    {
      source: "/",
      destination: "/dashboard",
      permanent: true,
    },
  ],
};

export default nextConfig;
