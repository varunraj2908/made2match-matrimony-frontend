import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import CookieConsent from "@/components/layout/CookieConsent";
import PWARegister from "@/components/layout/PWARegister";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";
import "./globals.css";

// A highly legible, screen-optimized UI font, self-hosted by next/font.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const DEFAULT_TITLE = "Made2Match — Matrimony | Find Your Perfect Life Partner";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: DEFAULT_TITLE,
    template: "%s · Made2Match",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "matrimony",
    "matrimonial",
    "marriage",
    "wedding",
    "find life partner",
    "verified profiles",
    "Kerala matrimony",
    "Made2Match",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_IN",
    images: [
      {
        url: "/golden-hearts.png",
        width: 1200,
        height: 630,
        alt: "Made2Match — Matrimony",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/golden-hearts.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Made2Match",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/golden-hearts.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#c0174c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
          <QueryProvider>
          {children}
        </QueryProvider>
        <CookieConsent />
        <PWARegister />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
