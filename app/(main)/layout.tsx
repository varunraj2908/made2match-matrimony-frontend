'use client'
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   const pathname = usePathname();
  
  return (
    <>
      <Navbar />
      {children}
      {!pathname.startsWith("/chat") && <Footer />}
    </>
  );
}