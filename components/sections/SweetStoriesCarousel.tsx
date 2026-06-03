"use client";

import Image from "next/image";

interface Story {
  name: string;
  date: string;
  image: string;
}

const STORIES: Story[] = [
  { name: "Pratep & Anita", date: "12 Apr 2025", image: "/image1.jpg" },
  { name: "Madhura & Rajeev", date: "08 Mar 2025", image: "/image2.jpg" },
  { name: "Sameer & Suchitra", date: "23 Feb 2025", image: "/image3.jpg" },
  { name: "Saagaresh & Sirisha", date: "10 Jan 2025", image: "/image4.jpg" },
  { name: "Arjun & Lakshmi", date: "21 Dec 2024", image: "/image1.jpg" },
  { name: "Mohit & Sneha", date: "05 Dec 2024", image: "/image2.jpg" },
  { name: "Suresh & Naina", date: "18 Nov 2024", image: "/image3.jpg" },
  { name: "Ravi & Tara", date: "30 Oct 2024", image: "/image4.jpg" },
];

function StoryCard({ story }: { story: Story }) {
  return (
    <div className="shrink-0 w-56 sm:w-64 bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group/card cursor-pointer">
      <div className="relative w-full h-44 sm:h-52">
        <Image
          src={story.image}
          alt={story.name}
          fill
          className="object-cover group-hover/card:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 224px, 256px"
        />
      </div>
      <div className="px-4 py-3 text-center bg-[#fbeef2]">
        <p
          className="text-gray-800 font-bold text-sm"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {story.name}
        </p>
        <p className="text-[10px] text-gray-500 mt-0.5">{story.date}</p>
      </div>
    </div>
  );
}

export default function SweetStoriesCarousel() {
  return (
    <section className="bg-white px-0 py-14 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-10 px-4">
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

      {/* Continuous smooth marquee. Edge fades hint that it keeps scrolling. */}
      <div className="group relative">
        {/* left / right fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 z-10 bg-gradient-to-l from-white to-transparent" />

        <div className="flex w-max animate-stories-scroll group-hover:[animation-play-state:paused] gap-4 sm:gap-5 px-4">
          {/* Two copies of the list make the -50% loop seamless. */}
          {[...STORIES, ...STORIES].map((s, i) => (
            <StoryCard key={`${s.name}-${i}`} story={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
