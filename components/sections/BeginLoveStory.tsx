import { useState } from "react";

export default function BeginLoveStory({ onClick,
}: {
  onClick: () => void;}) {
  const [email, setEmail] = useState("");
  return (
    <section
      className="my-4 overflow-hidden relative px-4 sm:px-6 lg:px-8 py-10 min-h-40 border-3 border-[#8b1a3a]"
      style={{
        background:
          "linear-gradient(135deg, #8b1a3a 0%, #c0174c 60%, #d4185a 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto relative flex items-center">
        {/* Decorative circles — hidden on small screens to avoid crowding */}
        <div className="hidden md:block absolute right-32 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-white/10" />
        <div className="hidden md:block absolute right-20 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/10" />

        <div className="flex-1 z-10 md:pr-32">
          <h2 className="text-white text-xl sm:text-2xl font-extrabold mb-2">
            Begin Your Love Story Today 💍
          </h2>
          <p className="text-white/80 text-xs sm:text-sm mb-5 max-w-sm">
            Join over 10 lakh happy couples. Create your free profile and let our
            intelligent system find your perfect match.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="bg-white/20 border border-white/40 rounded-full px-5 py-2 text-white placeholder-white/60 text-sm focus:outline-none focus:bg-white/30 w-full sm:w-56"
            />
            <button onClick={onClick} className="btn-primary cursor-pointer px-6 py-2 rounded-full text-sm shrink-0">
              Register Free →
            </button>
          </div>
        </div>

        <div className="hidden md:block absolute right-16 top-1/2 -translate-y-1/2 text-7xl z-10 select-none">
          🌹
        </div>
      </div>
    </section>
  );
}
