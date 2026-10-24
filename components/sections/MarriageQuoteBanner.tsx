import Image from "next/image";

export default function MarriageQuoteBanner({
  onClick,
}: {
  onClick: () => void;
}) {
  const features = [
    {
      title: "Get Complete Family Information",
      desc: "We provide complete family information so you can make an informed decision before connecting.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "Get Matches from your Community",
      desc: "Connect with members of your community who share the same traditions, values and beliefs.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      title: "Find Common Links with Prospects",
      desc: "Discover common interests, college or company links between your profile and prospect profiles.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
    },
  ];

  return (
    <section
      className="relative overflow-hidden "
      style={{
        background: "linear-gradient(135deg, #8b1a3a 0%, #c0174c 50%, #d4185a 100%)",
      }}
    >
      {/* Brush-stroke / torn-edge transition between the pink panel
          and the right-hand couple photo (desktop only). The SVG draws a
          jagged vertical edge with the same dark-pink colour, masking the
          image with an irregular boundary. */}
      <svg
        aria-hidden
        viewBox="0 0 200 800"
        preserveAspectRatio="none"
        className="hidden md:block absolute top-0 bottom-0 right-0 w-32 lg:w-48 z-5 pointer-events-none"
        style={{ left: "calc(50% - 4rem)" }}
      >
       
        <path
          d="M0,0 L120,0
             L100,90 L150,160 L95,230 L140,300 L100,380 L150,450
             L100,520 L155,590 L95,660 L145,730 L100,800
             L0,800 Z"
          fill="url(#brushPaint)"
        />
        <g fill="white" opacity="0.45">
          <circle cx="140" cy="120" r="1.5" />
          <circle cx="155" cy="220" r="1.2" />
          <circle cx="160" cy="340" r="2.0" />
          <circle cx="148" cy="480" r="1.4" />
          <circle cx="158" cy="620" r="1.8" />
          <circle cx="145" cy="720" r="1.2" />
        </g>
      </svg>

      <div className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-0 md:pt-16 md:pb-0">
        <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-2 lg:px-6">
        {/* LEFT — copy */}
        <div className="text-white relative z-10">
          <h2
            className="text-3xl sm:text-4xl font-extrabold leading-tight mb-2"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Why Choose <span className="italic">My Wedding?</span>
          </h2>
          <div className="h-px w-16 bg-white/60 mb-5" />
          <p className="text-white/85 text-sm mb-6 max-w-md leading-relaxed">
            We are a leading matrimonial platform connecting hearts in a meaningful, transparent way.
          </p>

          <ul className="space-y-5">
            {features.map((f) => (
              <li key={f.title} className="flex gap-4">
                <span
                  className="w-10 h-10 rounded-full border-2 border-white/70 flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  {f.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm mb-0.5">
                    {f.title}
                  </p>
                  <p className="text-white/75 text-xs leading-relaxed max-w-md">
                    {f.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={onClick}
            className="mt-8 btn-primary px-7 py-3 rounded-md text-sm cursor-pointer"
          >
            REGISTER FREE →
          </button>
        </div>

        {/* RIGHT — lady image with floating cards */}
        <div className="relative w-full h-64 sm:h-80 md:h-[520px] self-end px-6">
          {/* Center image — bottom aligned, touches section bottom */}
          <Image
            src="/001 transparent.png"
            alt="Made2Match Lady"
            fill
            className="object-contain object-[center_30%]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Top badge */}
          <div className="card-float absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-white rounded-2xl px-4 py-2 shadow-lg flex items-center gap-2 whitespace-nowrap" style={{ animationDelay: "0s" }}>
            <span className="text-[#c0174c] text-sm">♥</span>
            <div>
              <p className="text-[13px] font-bold text-gray-800">Smart face matching</p>
              <p className="text-[10px] text-gray-400">Find your perfect match</p>
            </div>
          </div>

          {/* Anjali — top left */}
          <div className="card-float absolute top-[15%] left-6 z-20 bg-white rounded-2xl p-3 shadow-xl w-36 text-center" style={{ animationDelay: "0.3s" }}>
            <div className="relative w-12 h-12 mx-auto mb-1.5">
              <div className="absolute inset-0 rounded-full p-[2px]" style={{ background: "linear-gradient(135deg, #f97316, #c0174c)" }}>
                <div className="w-full h-full rounded-full flex items-center justify-center text-white font-black text-xl" style={{ background: "linear-gradient(135deg, #f97316, #c0174c)" }}>A</div>
              </div>
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[8px]">✓</span>
            </div>
            <p className="text-[13px] font-bold text-gray-800">Anjali, 26</p>
            <p className="text-[10px] text-gray-400 leading-tight">Kochi · Software Engineer</p>
            <p className="text-[11px] font-bold text-[#c0174c] my-1">94% match</p>
            <button className="w-full py-1.5 rounded-lg text-[11px] font-bold text-white" style={{ background: "#c0174c" }}>♥ Send interest</button>
          </div>

          {/* Rahul — top right */}
          <div className="card-float absolute top-[15%] right-6 z-20 bg-white rounded-2xl p-3 shadow-xl w-36 text-center" style={{ animationDelay: "0.7s" }}>
            <div className="relative w-12 h-12 mx-auto mb-1.5">
              <div className="absolute inset-0 rounded-full" style={{ padding: 2, background: "linear-gradient(135deg, #7c3aed, #c0174c)" }}>
                <div className="w-full h-full rounded-full flex items-center justify-center text-white font-black text-xl" style={{ background: "linear-gradient(135deg, #7c3aed, #c0174c)" }}>R</div>
              </div>
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[8px]">✓</span>
            </div>
            <p className="text-[13px] font-bold text-gray-800">Rahul, 29</p>
            <p className="text-[10px] text-gray-400 leading-tight">Thrissur · Doctor</p>
            <p className="text-[11px] font-bold text-[#c0174c] my-1">91% match</p>
            <button className="w-full py-1.5 rounded-lg text-[11px] font-bold text-white" style={{ background: "#c0174c" }}>♥ Send interest</button>
          </div>

          {/* Meera — bottom left */}
          <div className="card-float absolute bottom-[15%] left-6 z-20 bg-white rounded-2xl p-3 shadow-xl w-36 text-center" style={{ animationDelay: "1s" }}>
            <div className="relative w-12 h-12 mx-auto mb-1.5">
              <div className="absolute inset-0 rounded-full" style={{ padding: 2, background: "linear-gradient(135deg, #f97316, #eab308)" }}>
                <div className="w-full h-full rounded-full flex items-center justify-center text-white font-black text-xl" style={{ background: "linear-gradient(135deg, #f97316, #eab308)" }}>M</div>
              </div>
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[8px]">✓</span>
            </div>
            <p className="text-[13px] font-bold text-gray-800">Meera, 27</p>
            <p className="text-[10px] text-gray-400 leading-tight">Kozhikode · Teacher</p>
            <p className="text-[11px] font-bold text-[#c0174c] my-1">89% match</p>
            <button className="w-full py-1.5 rounded-lg text-[11px] font-bold text-white" style={{ background: "#c0174c" }}>♥ Send interest</button>
          </div>

          {/* Divya — bottom right */}
          <div className="card-float absolute bottom-[15%] right-6 z-20 bg-white rounded-2xl p-3 shadow-xl w-36 text-center" style={{ animationDelay: "1.4s" }}>
            <div className="relative w-12 h-12 mx-auto mb-1.5">
              <div className="absolute inset-0 rounded-full" style={{ padding: 2, background: "linear-gradient(135deg, #c0174c, #7c3aed)" }}>
                <div className="w-full h-full rounded-full flex items-center justify-center text-white font-black text-xl" style={{ background: "linear-gradient(135deg, #c0174c, #7c3aed)" }}>D</div>
              </div>
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[8px]">✓</span>
            </div>
            <p className="text-[13px] font-bold text-gray-800">Divya, 28</p>
            <p className="text-[10px] text-gray-400 leading-tight">Palakkad · Chartered Accountant</p>
            <p className="text-[11px] font-bold text-[#c0174c] my-1">85% match</p>
            <button className="w-full py-1.5 rounded-lg text-[11px] font-bold text-white" style={{ background: "#c0174c" }}>♥ Send interest</button>
          </div>

          {/* Bottom badge */}
          <div className="card-float absolute bottom-2 left-1/2 -translate-x-1/2 z-20 bg-white rounded-2xl px-4 py-2 shadow-lg flex items-center gap-2 whitespace-nowrap" style={{ animationDelay: "0.5s" }}>
            <span className="text-green-500 text-sm">✓</span>
            <div>
              <p className="text-[13px] font-bold text-gray-800">Verified profiles</p>
              <p className="text-[10px] text-gray-400">Genuine members only</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
