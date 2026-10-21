import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Serve prerendered pages straight from the Worker's static assets (free, no R2/KV needed).
// Read-only: fine while pages are rebuilt on each deploy. Switch to the R2 or KV cache
// if we later need on-demand revalidation (e.g. albums updated from the admin dashboard).
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
