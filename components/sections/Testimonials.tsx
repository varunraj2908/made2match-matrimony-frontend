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
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s. When an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    couple: "Prince & Kavita",
    city: "India, Delhi",
    photos: ["/image1.jpg", "/image2.jpg", "/image3.jpg"],
  },
  {
    quote:
      "We connected on this platform last year and got married within months. The verified profiles and family information helped us trust the process and our families.",
    couple: "Aman & Riya",
    city: "Mumbai, India",
    photos: ["/image2.jpg", "/image3.jpg", "/image4.jpg"],
  },
  {
    quote:
      "Finding the right partner felt effortless once we joined. The community-based matching is what made all the difference for our families.",
    couple: "Rahul & Pooja",
    city: "Bangalore, India",
    photos: ["/image4.jpg", "/image1.jpg", "/image3.jpg"],
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const t = TESTIMONIALS[idx];

  return (
    <section className="relative bg-white px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
      {/* Decorative dots */}
      <span
        aria-hidden
        className="absolute top-10 left-10 w-16 h-16 rounded-full hidden md:block"
        style={{ background: "#3da5d9" }}
      />
      <span
        aria-hidden
        className="absolute bottom-10 left-32 w-8 h-8 rounded-full hidden md:block"
        style={{ background: "#c0174c" }}
      />
      <span
        aria-hidden
        className="absolute top-1/2 right-10 w-12 h-12 rounded-full hidden md:block"
        style={{ background: "#3da5d9" }}
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
          Testimonial
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
                  className="object-cover"
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
