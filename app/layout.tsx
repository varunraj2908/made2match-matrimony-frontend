import type { Metadata, Viewport } from "next";
import QueryProvider from "@/providers/QueryProvider";
import CookieConsent from "@/components/layout/CookieConsent";
import PWARegister from "@/components/layout/PWARegister";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Made2Match",
  title: {
    default: "Made2Match — Matrimony",
    template: "%s · Made2Match",
  },
  description:
    "Find your perfect life partner with Made2Match — verified profiles, smart matches and a trusted matrimony experience.",
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
    <html lang="en">
      <body>
          <QueryProvider>
          {children}
        </QueryProvider>
        <CookieConsent />
        <PWARegister />
      </body>
    </html>
  );
}
