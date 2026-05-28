"use client";
import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react"; // ✅ ADD THIS
import SectionNavbar from "@/components/layout/SectionNavbar";
import Header from "@/components/layout/Header";
import StatusBar from "@/components/sections/StatsBar";
import BannerQuote from "@/components/sections/BannerQuote";
import SearchSection from "@/components/sections/SearchSection";
import SuccessStories from "@/components/sections/SuccessStories";
import BeginLoveStory from "@/components/sections/BeginLoveStory";
import BrowseBySection from "@/components/sections/BrowseBySection";
import MembershipPlans from "@/components/sections/MembershipPlans";
import FeaturedProfiles from "@/components/sections/FeaturedProfiles";
import HeroRegistration from "@/components/sections/HeroRegistration";
import CTARegisterBanner from "@/components/sections/CTARegisterBanner";
import MarriageQuoteBanner from "@/components/sections/MarriageQuoteBanner";
import RegisterNowButton from "@/components/ui/RegisterNowButton";
import RegisterModal from "@/components/modals/RegisterModal";
import HowItWorks from "@/components/sections/HowItWorks";
import FAQSection from "@/components/sections/FAQSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [fromHeader, setFromHeader] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showTopBtn, setShowTopBtn] = useState(false); 

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = homeRef.current?.offsetHeight || 600;
      setShowHeader(window.scrollY < heroHeight - 80);
      setShowTopBtn(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openFromHeader = () => { setFromHeader(true);  setOpen(true); };
  const openFromPage   = () => { setFromHeader(false); setOpen(true); };
  const close          = () => { setOpen(false); setFromHeader(false); };

  const homeRef           = useRef<HTMLDivElement>(null);
  const workingFlowRef    = useRef<HTMLDivElement>(null);
  const successStoriesRef = useRef<HTMLDivElement>(null);
  const plansRef          = useRef<HTMLDivElement>(null);
  const faqsRef           = useRef<HTMLDivElement>(null);
  const featuredRef       = useRef<HTMLDivElement>(null);

 const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    "home":              homeRef,
    "Working Flow":      workingFlowRef,
    "Success Stories":   successStoriesRef,
    "Plans":             plansRef,
    "Faqs":              faqsRef,
    "Featured Profiles": featuredRef,
  };

  const scrollTo = (key: string) => {
    if (key === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      refs[key]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const navTop = showHeader ? "top-[72px]" : "top-0";

  return (
    <div className="min-h-screen bg-white font-sans text-sm">

      {showHeader && <Header onClick={openFromHeader} />}

      <SectionNavbar onScrollTo={scrollTo} navTop={navTop} />

      <div ref={homeRef}>
        <HeroRegistration />
      </div>

      <SearchSection />
      <BannerQuote onClick={openFromPage} />

      <div ref={featuredRef}>
        <FeaturedProfiles />
      </div>

      <MarriageQuoteBanner onClick={openFromPage} />

      <div id="success-stories" ref={successStoriesRef}>
        <SuccessStories />
      </div>

      <StatusBar />
      <CTARegisterBanner onClick={openFromPage} />

      <div ref={plansRef}>
        <MembershipPlans />
      </div>

      <BeginLoveStory onClick={openFromPage} />

      <div ref={workingFlowRef}>
        <HowItWorks />
      </div>

      <div ref={faqsRef}>
        <FAQSection />
      </div>

      <BrowseBySection />
      <Footer/>
      <RegisterNowButton onClick={openFromPage} />

      <RegisterModal open={open} onClose={close} belowHeader={fromHeader} />

      {showTopBtn && !open && (
       
          
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-999 bg-[#c0174c] hover:bg-[#8b1a3a] text-white p-3 rounded-full shadow-lg transition-all duration-300"
        >
          <ArrowUp size={20} />
        </button>
       
      )}

    </div>
  );
}