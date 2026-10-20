"use client";

import Image from "next/image";

/* ────────────────────────────────────────────────────────────────────
   Featured profile cards — full-bleed photo cards with a gradient
   overlay, a hanging tier ribbon, a rating badge, name, bio, two stats
   and a Follow button. Standalone 3-up responsive row.
   ──────────────────────────────────────────────────────────────────── */

export interface ShowcaseProfile {
  image: string;
  name: string;
  bio: string;
  rating: number; // 0–5 (e.g. 4.8)
  age: number | string;
  city: string;
}

const DEFAULT_PROFILES: ShowcaseProfile[] = [
  {
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    name: "Ananya Nair",
    bio: "Doctor, loves travel, books and weekend treks.",
    rating: 4.8,
    age: 27,
    city: "Kochi",
  },
  {
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Arjun Kumar",
    bio: "Architect, foodie and fitness enthusiast.",
    rating: 4.9,
    age: 30,
    city: "Bangalore",
  },
  {
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Aishwarya Menon",
    bio: "MBA, finance pro. Music, cooking & long talks.",
    rating: 4.6,
    age: 26,
    city: "Trivandrum",
  },
];

const tierOf = (rating: number) =>
  rating >= 4.8
    ? { label: "DIAMOND", bg: "linear-gradient(135deg,#5b2a86,#2d1b35)" }
    : rating >= 4.5
    ? { label: "GOLD", bg: "linear-gradient(135deg,#d4a017,#8a6d11)" }
    : { label: "SILVER", bg: "linear-gradient(135deg,#9ca3af,#4b5563)" };

function ProfileCard({ p }: { p: ShowcaseProfile }) {
  const tier = tierOf(p.rating);
  return (
    <div className="relative w-full h-[380px] rounded-[26px] overflow-hidden shadow-xl bg-gray-900 group">
      {/* Photo */}
      <Image
        src={p.image}
        alt={p.name}
        fill
        sizes="(max-width:640px) 100vw, 320px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Dark + signature orange-glow overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.9) 6%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0) 72%), " +
            "linear-gradient(0deg, rgba(255,110,40,0.5) 2%, rgba(255,110,40,0) 44%)",
        }}
      />

      {/* Tier ribbon — top-left */}
      <div
        className="absolute top-0 left-4 z-10 px-2.5 pt-2 pb-3 text-center text-white shadow-lg"
        style={{ background: tier.bg, clipPath: "polygon(0 0,100% 0,100% 78%,50% 100%,0 78%)" }}
      >
        <div className="text-[8px] leading-none text-amber-300">★★★★★</div>
        <div className="text-[8px] font-bold tracking-[0.15em] mt-1">{tier.label}</div>
      </div>

      {/* Rating badge — top-right */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-0.5 bg-white/85 backdrop-blur-sm px-2 py-0.5 rounded-full text-[11px] font-bold text-gray-800 shadow">
        {p.rating.toFixed(1)}
        <span className="text-amber-500">★</span>
      </div>

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-white">
        <h3 className="text-2xl font-bold leading-tight font-serif drop-shadow">{p.name}</h3>
        <p className="text-[11px] text-white/85 leading-snug mt-1 font-mono line-clamp-2">{p.bio}</p>

        <div className="flex items-end justify-between mt-3 gap-2">
          <div className="flex gap-4">
            <div>
              <p className="text-[8px] uppercase tracking-wider text-white/60">Age</p>
              <p className="text-sm font-bold">{p.age}</p>
            </div>
            <div>
              <p className="text-[8px] uppercase tracking-wider text-white/60">City</p>
              <p className="text-sm font-bold">{p.city}</p>
            </div>
          </div>
          <button className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full hover:bg-white transition-colors shadow">
            Follow
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProfileCards({
  profiles = DEFAULT_PROFILES,
  title = "Featured Profiles",
}: {
  profiles?: ShowcaseProfile[];
  title?: string;
}) {
  return (
    <section className="bg-gray-100 rounded-2xl p-4 sm:p-6">
      {title && (
        <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-3 sm:mb-4">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {profiles.map((p) => (
          <ProfileCard key={p.name} p={p} />
        ))}
      </div>
    </section>
  );
}
