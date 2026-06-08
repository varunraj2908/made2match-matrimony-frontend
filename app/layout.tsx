
import QueryProvider from "@/providers/QueryProvider";
import CookieConsent from "@/components/layout/CookieConsent";
import "./globals.css";

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
      </body>
    </html>
  );
}