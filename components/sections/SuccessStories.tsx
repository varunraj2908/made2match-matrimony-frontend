"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Story {
  name: string;
  date: string;
  image: string;
}

const STORIES: Story[] = [
  { name: "Pratep & Anita",       date: "12 Apr 2025", image: "/image1.jpg" },
  { name: "Madhura & Rajeev",     date: "08 Mar 2025", image: "/image2.jpg" },
  { name: "Sameer & Suchitra",    date: "23 Feb 2025", image: "/image3.jpg" },
  { name: "Saagaresh & Sirisha",  date: "10 Jan 2025", image: "/image4.jpg" },
  { name: "Arjun & Lakshmi",      date: "21 Dec 2024", image: "/image1.jpg" },
  { name: "Mohit & Sneha",        date: "05 Dec 2024", image: "/image2.jpg" },
  { name: "Suresh & Naina",       date: "18 Nov 2024", image: "/image3.jpg" },
  { name: "Ravi & Tara",          date: "30 Oct 2024", image: "/image4.jpg" },
];

const PER_PAGE_DESKTOP = 4;

export default function SuccessStories() {
  /* ─── Desktop paging (4 at a time) ────────────────────── */
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(STORIES.length / PER_PAGE_DESKTOP);
  const start = page * PER_PAGE_DESKTOP;
  const visible = STORIES.slice(start, start + PER_PAGE_DESKTOP);
  const goPrev = () => setPage((p) => (p - 1 + totalPages) % totalPages);
  const goNext = () => setPage((p) => (p + 1) % totalPages);

  /* ─── Mobile carousel (swipe one card at a time) ──────── */
  const [mIndex, setMIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Sync state when user finishes swiping
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let timeout: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        const w = el.clientWidth;
        if (w > 0) {
          const idx = Math.round(el.scrollLeft / w);
          setMIndex(Math.max(0, Math.min(STORIES.length - 1, idx)));
        }
      }, 90);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  const scrollToM = (idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const target = Math.max(0, Math.min(STORIES.length - 1, idx));
    el.scrollTo({ left: target * el.clientWidth, behavior: "smooth" });
    setMIndex(target);
  };

  return (
    <section className="bg-white px-4 sm:px-6 lg:px-8 py-14">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-gray-800"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Sweet Stories From <span className="italic">our Lovers</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3 mb-1">
            <span className="h-px w-6 bg-gray-300" />
            <span className="text-[#c0174c]">♥</span>
            <span className="h-px w-6 bg-gray-300" />
          </div>
          <p className="text-gray-500 text-xs mt-1">
            Get inspired from over 25,000+ Happy Stories
          </p>
        </div>

        {/* ─── MOBILE: swipeable carousel ─────────────────── */}
        <div className="sm:hidden">
          <div className="relative">
            <div
              ref={trackRef}
              className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 gap-3"
              style={{ scrollbarWidth: "none" }}
            >
              {STORIES.map((s) => (
                <div
                  key={`${s.name}-${s.date}`}
                  className="snap-center shrink-0 w-full"
                >
                  <div className="bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm">
                    <div className="relative w-full h-56">
                      <Image
                        src={s.image}
                        alt={s.name}
                        fill
                        className="object-cover"
                        sizes="100vw"
                      />
                    </div>
                    <div className="px-4 py-3 text-center bg-[#fbeef2]">
                      <p
                        className="text-gray-800 font-bold text-sm"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {s.name}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{s.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile prev/next */}
            <button
              onClick={() => scrollToM(mIndex - 1)}
              aria-label="Previous story"
              disabled={mIndex === 0}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#c0174c] shadow-md flex items-center justify-center transition disabled:opacity-40"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => scrollToM(mIndex + 1)}
              aria-label="Next story"
              disabled={mIndex === STORIES.length - 1}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#c0174c] shadow-md flex items-center justify-center transition disabled:opacity-40"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Mobile dots */}
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {STORIES.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToM(i)}
                aria-label={`Go to story ${i + 1}`}
                className="h-2 rounded-full transition-all"
                style={{
                  width: i === mIndex ? 18 : 8,
                  background: i === mIndex ? "#c0174c" : "#e5d3d8",
                }}
              />
            ))}
          </div>
        </div>

        {/* ─── DESKTOP: existing 4-up grid with side arrows ── */}
        <div className="hidden sm:block">
          <div className="relative">
            <button
              onClick={goPrev}
              aria-label="Previous stories"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-9 h-9 rounded-full bg-[#c0174c] hover:bg-[#a01040] text-white shadow-md flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {visible.map((s) => (
                <div
                  key={`${s.name}-${s.date}`}
                  className="bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative w-full h-44 sm:h-48">
                    <Image
                      src={s.image}
                      alt={s.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="px-4 py-3 text-center bg-[#fbeef2]">
                    <p
                      className="text-gray-800 font-bold text-sm"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {s.name}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{s.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={goNext}
              aria-label="Next stories"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-9 h-9 rounded-full bg-[#c0174c] hover:bg-[#a01040] text-white shadow-md flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`Go to page ${i + 1}`}
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: i === page ? 22 : 8,
                    background: i === page ? "#c0174c" : "#e5d3d8",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
