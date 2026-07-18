"use client";

import Image from "next/image";
import { useState } from "react";

interface Testimonial {
  quote: string;
  couple: string;
  city: string;
  photos: string[];
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Made2Match brought our families together in the most natural way. The profile details were genuine, our values matched, and every conversation gave us more confidence about building a life together.",
    couple: "Adithyan & Devika",
    city: "Kochi, Kerala",
    photos: ["/couple2.jpeg", "/Traditional Kerala wedding portrait.png", "/Newlywed South Asian couple in traditional attire.png"],
  },
  {
    quote:
      "The community and preference filters helped us find each other without making the journey feel complicated. Our families connected quickly, and today we are grateful that one profile visit became our forever story.",
    couple: "Arjun & Meera",
    city: "Thrissur, Kerala",
    photos: ["/Traditional Kerala wedding portrait.png", "/couple2.jpeg", "/Newlywed South Asian couple in traditional attire.png"],
  },
  {
    quote:
      "We were both looking for someone who respected family, tradition, and career goals. Made2Match introduced us at the right time and gave us a safe space to understand each other before our families met.",
    couple: "Naveen & Lakshmi",
    city: "Kozhikode, Kerala",
    photos: ["/Newlywed South Asian couple in traditional attire.png", "/Traditional Kerala wedding portrait.png", "/couple2.jpeg"],
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const t = TESTIMONIALS[idx];

  return (
    <section className="relative overflow-hidden bg-[#fffaf5] px-4 py-16 sm:px-6 lg:px-8">
      {/* Decorative dots */}
      <span
        aria-hidden
        className="absolute top-10 left-10 w-16 h-16 rounded-full hidden md:block"
        style={{ background: "#e8b44f" }}
      />
      <span
        aria-hidden
        className="absolute bottom-10 left-32 w-8 h-8 rounded-full hidden md:block"
        style={{ background: "#c0174c" }}
      />
      <span
        aria-hidden
        className="absolute top-1/2 right-10 w-12 h-12 rounded-full hidden md:block"
        style={{ background: "#e8b44f" }}
      />
      <span
        aria-hidden
        className="absolute bottom-12 right-32 w-16 h-16 rounded-full hidden md:block"
        style={{ background: "#c0174c" }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <h2
          className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-1"
          style={{ fontFamily: "Georgia, serif" }}
        >
          What Our Couples Say
        </h2>
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="h-px w-6 bg-gray-300" />
          <span className="text-[#c0174c]">♥</span>
          <span className="h-px w-6 bg-gray-300" />
        </div>

        {/* Photos cluster */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex -space-x-4">
            {t.photos.map((p, i) => (
              <div
                key={`${idx}-${i}`}
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-white shadow-md"
                style={{ zIndex: 10 - i }}
              >
                <Image
                  src={p}
                  alt={`${t.couple} ${i + 1}`}
                  fill
                  className="object-cover object-top"
                  sizes="80px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <p
          className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl mx-auto italic"
          style={{ fontFamily: "Georgia, serif" }}
        >
          “{t.quote}”
        </p>

        {/* Couple name */}
        <p
          className="text-[#c0174c] text-xl sm:text-2xl font-extrabold"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {t.couple}
        </p>
        <p className="text-gray-500 text-xs mt-1">{t.city}</p>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-7">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === idx ? 22 : 8,
                background: i === idx ? "#c0174c" : "#e5d3d8",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
