import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Running on Vercel's Next.js runtime (not static export).
  // Enables Server Components, Server Actions, and ISR revalidation
  // required for the Firebase CMS (see docs/CMS-PLAN.md).
};

export default nextConfig;
