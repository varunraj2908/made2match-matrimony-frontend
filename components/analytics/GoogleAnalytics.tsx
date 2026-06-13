import Script from "next/script";

// Renders the GA4 (gtag.js) snippet only when NEXT_PUBLIC_GA_ID is set, so
// local/dev builds without an ID stay clean. Set the env var to your
// Measurement ID (looks like "G-XXXXXXXXXX") to enable analytics.
export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
