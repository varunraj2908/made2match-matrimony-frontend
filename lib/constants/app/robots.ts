import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Public marketing pages stay crawlable; authenticated app flows, onboarding
// steps and user-specific pages are kept out of the index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/login",
        "/registration",
        "/verify-otp",
        "/upload-image",
        "/onboarding",
        "/eating-habit",
        "/education-details",
        "/hobbies-interests",
        "/horoscope",
        "/star-details",
        "/success",
        "/success-onboarding",
        "/account-exists",
        "/home",
        "/search",
        "/chat",
        "/profiles",
        "/edit-profile",
        "/my-profile",
        "/interests",
        "/partnerpreferences",
        "/notifications",
        "/settings",
        "/help",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
