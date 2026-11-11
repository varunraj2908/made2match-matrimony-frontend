"use client";

import Topbar from "@/components/layout/Topbar";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Login & register are full-screen splash-themed — no top header.
  const hideTopbar = ["/login", "/register", "/forgot-password", "/reset-password"].includes(pathname);

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ maxWidth: "100vw" }}>
      {!hideTopbar && <Topbar />}
      <main className="flex-1 h-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}
