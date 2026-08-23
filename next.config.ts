import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  async redirects() {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
    const commonRedirects = [
      {
        source: "/product/ecommerce",
        destination: "/product/catalog",
        permanent: true,
      },
      {
        source: "/product/contacts",
        destination: "/contact_directory",
        permanent: true,
      }
    ];

    if (basePath) {
      return [
        ...commonRedirects,
        {
          source: "/",
          destination: `${basePath}/landing`,
          basePath: false,
          permanent: false,
        },
        {
          source: "/",
          destination: "/landing",
          permanent: false,
        },
      ];
    }
    return [
      ...commonRedirects,
      {
        source: "/",
        destination: "/landing",
        permanent: false,
      },
    ];
  },
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_BASE_URL: (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/api",
    NEXT_PUBLIC_STORAGE_URL: process.env.NEXT_PUBLIC_STORAGE_URL,
    NEXT_PUBLIC_ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
