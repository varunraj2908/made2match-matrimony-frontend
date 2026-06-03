"use client";
import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react"; // ✅ ADD THIS
import SectionNavbar from "@/components/layout/SectionNavbar";
import Header from "@/components/layout/Header";
import StatusBar from "@/components/sections/StatsBar";
import BannerQuote from "@/components/sections/BannerQuote";
import SuccessStories from "@/components/sections/SuccessStories";
import BeginLoveStory from "@/components/sections/BeginLoveStory";
import BrowseBySection from "@/components/sections/BrowseBySection";
import PricingSection from "@/components/ui/pricing-section";
import FeaturedProfiles from "@/components/sections/FeaturedProfiles";
import HeroRegistration, { SearchBar } from "@/components/sections/HeroRegistration";
import MarriageQuoteBanner from "@/components/sections/MarriageQuoteBanner";
import RegisterNowButton from "@/components/ui/RegisterNowButton";
import RegisterModal from "@/components/modals/RegisterModal";
import HowItWorks from "@/components/sections/HowItWorks";
import FAQSection from "@/components/sections/FAQSection";
import Footer from "@/components/layout/Footer";
import Testimonials from "@/components/sections/Testimonials";
import LocationMap from "@/components/sections/LocationMap";
import Testimonials3D from "@/components/sections/Testimonials3D";
import SweetStoriesCarousel from "@/components/sections/SweetStoriesCarousel";
import ProfileBookModal from "@/components/sections/ProfileBookModal";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [fromHeader, setFromHeader] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [fixedNavH, setFixedNavH] = useState(144);

  const fixedNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Measure the actual height of the fixed Header + SectionNavbar block.
  // It's taller on mobile (Header stacks vertically) than on desktop.
  useEffect(() => {
    const el = fixedNavRef.current;
    if (!el) return;
    const measure = () => setFixedNavH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
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
      return;
    }
    const el = refs[key]?.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - fixedNavH;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#fdf5f5] font-sans text-sm"  >

      {/* Header + Navbar stick together at top:0 as a single block.
          Position fixed guarantees this regardless of any ancestor overflow. */}
      <div
        ref={fixedNavRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <Header onClick={openFromHeader} />
        <SectionNavbar onScrollTo={scrollTo} />
      </div>

      {/* Spacer matches the measured height of the fixed nav so content
          below isn't covered (mobile Header is taller than desktop). */}
      <div style={{ height: fixedNavH }} aria-hidden />

      <div ref={homeRef}>
        <HeroRegistration />
      </div>

      {/* On mobile: StatusBar first, then 'Find Your Match' search bar.
          On desktop (lg+): search bar first, then StatusBar — original order. */}
      <div className="flex flex-col">
        <div className="order-2 lg:order-1">
          <SearchBar />
        </div>
        <div className="order-1 lg:order-2">
          <StatusBar />
        </div>
      </div>
      <BannerQuote onClick={openFromPage} />

      <div ref={featuredRef} style={{ scrollMarginTop: fixedNavH }}>
        <FeaturedProfiles />
      </div>

      {/* <Testimonials3D /> */}

      {/* <SweetStoriesCarousel /> */}

      <ProfileBookModal />

      {/* <EasyToGetStarted /> */}

      <MarriageQuoteBanner onClick={openFromPage} />

      <div id="success-stories" ref={successStoriesRef} style={{ scrollMarginTop: fixedNavH }}>
        <SuccessStories />
      </div>

      {/* <CTARegisterBanner onClick={openFromPage} /> */}
      <Testimonials />


      <div ref={plansRef} style={{ scrollMarginTop: fixedNavH }}>
        <PricingSection />
      </div>

      <BeginLoveStory onClick={openFromPage} />

      <div ref={workingFlowRef} style={{ scrollMarginTop: fixedNavH }}>
        <HowItWorks />
      </div>

      <div ref={faqsRef} style={{ scrollMarginTop: fixedNavH }}>
        <FAQSection />
      </div>
      <LocationMap />
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