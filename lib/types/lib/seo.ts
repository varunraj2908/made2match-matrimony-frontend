// Single source of truth for the site's public origin.
// Used by metadata (canonical + Open Graph/Twitter), sitemap.ts and robots.ts.
//
// Set NEXT_PUBLIC_SITE_URL in your environment (e.g. Vercel project settings)
// to the real production domain. The fallback below is a placeholder — change
// it or, preferably, set the env var so canonical/OG URLs are correct.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://made2match.in"
).replace(/\/+$/, "");

export const SITE_NAME = "Made2Match";

export const SITE_DESCRIPTION =
  "Find your perfect life partner with Made2Match — verified profiles, smart matches and a trusted matrimony experience.";
