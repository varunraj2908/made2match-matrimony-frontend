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
        {/* white speckles — gives the painted edge a textured look */}
        <g fill="white" opacity="0.45">
          <circle cx="140" cy="120" r="1.5" />
          <circle cx="155" cy="220" r="1.2" />
          <circle cx="160" cy="340" r="2.0" />
          <circle cx="148" cy="480" r="1.4" />
          <circle cx="158" cy="620" r="1.8" />
          <circle cx="145" cy="720" r="1.2" />
        </g>
      </svg>

      <div className="relative px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
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

        {/* RIGHT — couple image */}
        <div className="relative w-full -bottom-16 h-64 sm:h-80 md:h-120 rounded-md overflow-hidden ">
          <Image
            src="/Newlywed South Asian couple in traditional attire.png"
            alt="Couple"
            fill
            className="object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        </div>
      </div>
    </section>
  );
}
