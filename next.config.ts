import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Cache Components stays off: with Next 16.4 + OpenNext it hangs requests in the
  // Workers runtime (setTimeout limitation). Revisit when OpenNext supports it on Workers.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Photos are resized by Supabase Storage / Cloudinary, not by Next's optimizer
    // (Next's optimizer on Cloudflare needs the paid Images binding).
    unoptimized: true,
  },
};

export default nextConfig;

// Lets `next dev` read Cloudflare bindings and .dev.vars locally.
initOpenNextCloudflareForDev();
