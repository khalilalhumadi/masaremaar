import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Running on Vercel's Next.js runtime (not static export).
  // Enables Server Components, Server Actions, and ISR revalidation
  // required for the Firebase CMS (see docs/CMS-PLAN.md).
  experimental: {
    serverActions: {
      // Allow up to 6 MB so admin image uploads (≤ 5 MB) fit in the body.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
