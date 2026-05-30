import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Running on Vercel's Next.js runtime (not static export).
  // Enables Server Components, Server Actions, and ISR revalidation
  // required for the Firebase CMS (see docs/CMS-PLAN.md).

  images: {
    remotePatterns: [
      // Firebase Storage — CMS project images.
      // Vercel caches and optimises each image variant so Firebase Storage
      // bandwidth is only consumed on the first cache-miss per image size.
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/masaremaar-a8c6d.appspot.com/**",
      },
      // New-format Storage bucket URL (firebasestorage.app)
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/masaremaar-a8c6d.firebasestorage.app/**",
      },
      // Unsplash — placeholder images used until real images are uploaded
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
