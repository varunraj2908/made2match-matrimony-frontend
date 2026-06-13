// "use client";

// import { useEffect, useRef, useState } from "react";

// const STEPS = [
//   {
//     number: "1",
//     title: "Register",
//     description: "Sign up and create your profile with your personal details, preferences and photos.",
//     align: "left",
//     color: "#e8a0aa",
//     ringColors: ["#fce4ec", "#f8bbd0", "#f48fb1"],
//     icon: (
//       <svg viewBox="0 0 80 80" width="56" height="56">
//         <circle cx="40" cy="26" r="14" fill="#7a0e1e" />
//         <ellipse cx="40" cy="62" rx="22" ry="16" fill="#b22234" />
//         <circle cx="40" cy="24" r="10" fill="#f4a07a" />
//         <circle cx="35" cy="28" r="3" fill="#7a0e1e" />
//         <circle cx="45" cy="28" r="3" fill="#7a0e1e" />
//         <path d="M28 22 Q30 10 40 10 Q50 10 52 22 Q48 14 40 14 Q32 14 28 22Z" fill="#7a0e1e" />
//       </svg>
//     ),
//   },
//   {
//     number: "2",
//     title: "Search",
//     description: "Browse thousands of verified profiles using smart filters to find your ideal match.",
//     align: "right",
//     color: "#e8a0aa",
//     ringColors: ["#fce4ec", "#f8bbd0", "#f48fb1"],
//     icon: (
//       <svg viewBox="0 0 80 80" width="56" height="56">
//         <circle cx="36" cy="36" r="18" fill="white" stroke="#7a0e1e" strokeWidth="4" />
//         <line x1="49" y1="49" x2="64" y2="64" stroke="#7a0e1e" strokeWidth="5" strokeLinecap="round" />
//         <path d="M28 34 Q28 28 34 28 Q37 28 38 31 Q39 28 42 28 Q48 28 48 34 Q48 40 38 46 Q28 40 28 34Z" fill="#b22234" />
//       </svg>
//     ),
//   },
//   {
//     number: "3",
//     title: "Connect",
//     description: "Express interest, send messages and connect with your perfect life partner.",
//     align: "left",
//     color: "#e8a0aa",
//     ringColors: ["#fce4ec", "#f8bbd0", "#f48fb1"],
//     icon: (
//       <svg viewBox="0 0 80 80" width="56" height="56">
//         <path d="M16 32 Q16 22 24 22 Q28 22 30 26 Q32 22 36 22 Q44 22 44 32 Q44 42 30 50 Q16 42 16 32Z" fill="#b22234" />
//         <path d="M36 44 Q36 34 44 34 Q48 34 50 38 Q52 34 56 34 Q64 34 64 44 Q64 54 50 62 Q36 54 36 44Z" fill="#e85d8a" opacity="0.85" />
//         <circle cx="40" cy="46" r="3" fill="#7a0e1e" />
//       </svg>
//     ),
//   },
// ];

// // ─── Pulse Circle ─────────────────────────────────────────────────────────────
// const PulseCircle = ({
//   color,
//   ringColors,
//   icon,
//   visible,
// }: {
//   color: string;
//   ringColors: string[];
//   icon: React.ReactNode;
//   visible: boolean;
// }) => (
//   <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
//     {/* Outer rings with pulse */}
//     {ringColors.map((rc, i) => (
//       <div
//         key={i}
//         className="absolute rounded-full"
//         style={{
//           width: 220 - i * 0,
//           height: 220 - i * 0,
//           background: rc,
//           opacity: visible ? 1 : 0,
//           transform: visible ? "scale(1)" : "scale(0.6)",
//           transition: `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`,
//           animation: visible ? `pulse-ring ${1.8 + i * 0.4}s ease-in-out ${i * 0.3}s infinite` : "none",
//         }}
//       />
//     ))}
//     {/* Inner rings */}
//     <div
//       className="absolute rounded-full"
//       style={{ width: 160, height: 160, background: ringColors[1] }}
//     />
//     <div
//       className="absolute rounded-full"
//       style={{ width: 110, height: 110, background: ringColors[0] }}
//     />
//     {/* Center white circle */}
//     <div
//       className="absolute rounded-full bg-white shadow-lg flex items-center justify-center z-10"
//       style={{ width: 80, height: 80, boxShadow: `0 4px 24px ${color}55` }}
//     >
//       {icon}
//     </div>
//   </div>
// );

// // ─── Dashed Connector ─────────────────────────────────────────────────────────
// const DashedConnector = ({ fromLeft, visible }: { fromLeft: boolean; visible: boolean }) => (
//   <div className="relative h-24 w-full overflow-visible">
//     <svg
//       viewBox="0 0 800 80"
//       preserveAspectRatio="none"
//       className="w-full h-full"
//       style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s ease" }}
//     >
//       <path
//         d={
//           fromLeft
//             ? "M 200 10 Q 400 80 600 10"
//             : "M 600 10 Q 400 80 200 10"
//         }
//         fill="none"
//         stroke="#b22234"
//         strokeWidth="2"
//         strokeDasharray="8 6"
//         strokeLinecap="round"
//         opacity="0.5"
//       />
//     </svg>
//   </div>
// );

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function HowItWorks() {
//   const [visibleSteps, setVisibleSteps] = useState<boolean[]>([false, false, false]);
//   const [visibleConnectors, setVisibleConnectors] = useState<boolean[]>([false, false]);
//   const sectionRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           STEPS.forEach((_, i) => {
//             setTimeout(() => {
//               setVisibleSteps((prev) => {
//                 const next = [...prev];
//                 next[i] = true;
//                 return next;
//               });
//             }, i * 350);
//           });
//           [0, 1].forEach((i) => {
//             setTimeout(() => {
//               setVisibleConnectors((prev) => {
//                 const next = [...prev];
//                 next[i] = true;
//                 return next;
//               });
//             }, (i + 1) * 500 + 200);
//           });
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.2 }
//     );
//     if (sectionRef.current) observer.observe(sectionRef.current);
//     return () => observer.disconnect();
//   }, []);

//   return (
//     <>
//       {/* Pulse keyframe */}
//       <style>{`
//         @keyframes pulse-ring {
//           0%   { transform: scale(1);    opacity: 0.9; }
//           50%  { transform: scale(1.07); opacity: 0.5; }
//           100% { transform: scale(1);    opacity: 0.9; }
//         }
//       `}</style>

//       <section ref={sectionRef} className="py-20 px-4 overflow-hidden relative" style={{ background: "#fdf5f5" }}>

//         {/* Decorative background blobs */}
//         {/* <div className="absolute top-0 left-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #f5d0d7 0%, transparent 70%)", transform: "translate(-30%, -30%)" }} />
//         <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #f5d0d7 0%, transparent 70%)", transform: "translate(30%, 30%)" }} /> */}
//         <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #fce4ec 0%, transparent 70%)", transform: "translate(-50%, -50%)" }} />

//         {/* Header */}
//         <div className="text-center mb-16 relative z-10">
//           <div className="inline-block mb-3">
//             <span className="text-xs font-bold tracking-widest text-[#b22234] uppercase bg-red-50 px-4 py-1.5 rounded-full border border-red-100">Simple Steps</span>
//           </div>
//           <h2
//             className="text-5xl font-black mb-4"
//             style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#7a0e1e" }}
//           >
//             How it works
//           </h2>
//           <p className="text-lg max-w-lg mx-auto leading-relaxed" style={{ color: "#c97080" }}>
//             At GetMarry, we&apos;re committed to supporting you on your journey to
//             love and companionship.
//           </p>
//         </div>

//         {/* Steps */}
//         <div className="max-w-4xl mx-auto relative z-10">
//           {STEPS.map((step, i) => (
//             <div key={step.number}>
//               {/* Step Row */}
//               <div
//                 className={`flex items-center gap-8 md:gap-16 ${
//                   step.align === "right" ? "flex-row-reverse" : "flex-row"
//                 }`}
//               >
//                 {/* Circle */}
//                 <div
//                   className="shrink-0"
//                   style={{
//                     opacity: visibleSteps[i] ? 1 : 0,
//                     transform: visibleSteps[i] ? "scale(1)" : "scale(0.7)",
//                     transition: "opacity 0.7s ease, transform 0.7s ease",
//                   }}
//                 >
//                   <PulseCircle
//                     color={step.color}
//                     ringColors={step.ringColors}
//                     icon={step.icon}
//                     visible={visibleSteps[i]}
//                   />
//                 </div>

//                 {/* Text */}
//                 <div
//                   className={`flex-1 ${step.align === "right" ? "text-right" : "text-left"}`}
//                   style={{
//                     opacity: visibleSteps[i] ? 1 : 0,
//                     transform: visibleSteps[i]
//                       ? "translateX(0)"
//                       : step.align === "right"
//                       ? "translateX(40px)"
//                       : "translateX(-40px)",
//                     transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
//                   }}
//                 >
//                   <h3
//                     className="text-4xl font-black mb-3"
//                     style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#7a0e1e" }}
//                   >
//                     {step.number}. {step.title}
//                   </h3>
//                   <p className="text-base leading-relaxed max-w-sm" style={{ color: "#c97080" }}>
//                     {step.description}
//                   </p>
//                 </div>
//               </div>

//               {/* Dashed connector between steps */}
//               {i < STEPS.length - 1 && (
//                 <DashedConnector fromLeft={step.align === "left"} visible={visibleConnectors[i]} />
//               )}
//             </div>
//           ))}
//         </div>

//         {/* CTA */}
//         <div
//           className="text-center mt-16 relative z-10"
//           style={{
//             opacity: visibleSteps[2] ? 1 : 0,
//             transform: visibleSteps[2] ? "translateY(0)" : "translateY(20px)",
//             transition: "opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s",
//           }}
//         >
//           <button className="bg-[#b22234] hover:bg-[#9a1d2b] text-white font-bold px-10 py-4 rounded-2xl text-base transition-all hover:scale-105 hover:shadow-xl shadow-md">
//             💕 Get Started Free
//           </button>
//         </div>
//       </section>
//     </>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    number: "1",
    title: "Register",
    description:
      "Sign up and create your profile with your personal details, preferences and photos.",
    align: "left",
    color: "#e8a0aa",
    ringColors: ["#fce4ec", "#f8bbd0", "#f48fb1"],
    icon: (
      <svg viewBox="0 0 80 80" width="56" height="56">
        <circle cx="40" cy="26" r="14" fill="#7a0e1e" />
        <ellipse cx="40" cy="62" rx="22" ry="16" fill="#b22234" />
        <circle cx="40" cy="24" r="10" fill="#f4a07a" />
        <circle cx="35" cy="28" r="3" fill="#7a0e1e" />
        <circle cx="45" cy="28" r="3" fill="#7a0e1e" />
        <path
          d="M28 22 Q30 10 40 10 Q50 10 52 22 Q48 14 40 14 Q32 14 28 22Z"
          fill="#7a0e1e"
        />
      </svg>
    ),
  },
  {
    number: "2",
    title: "Search",
    description:
      "Browse thousands of verified profiles using smart filters to find your ideal match.",
    align: "right",
    color: "#e8a0aa",
    ringColors: ["#fce4ec", "#f8bbd0", "#f48fb1"],
    icon: (
      <svg viewBox="0 0 80 80" width="56" height="56">
        <circle
          cx="36"
          cy="36"
          r="18"
          fill="white"
          stroke="#7a0e1e"
          strokeWidth="4"
        />
        <line
          x1="49"
          y1="49"
          x2="64"
          y2="64"
          stroke="#7a0e1e"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M28 34 Q28 28 34 28 Q37 28 38 31 Q39 28 42 28 Q48 28 48 34 Q48 40 38 46 Q28 40 28 34Z"
          fill="#b22234"
        />
      </svg>
    ),
  },
  {
    number: "3",
    title: "Connect",
    description:
      "Express interest, send messages and connect with your perfect life partner.",
    align: "left",
    color: "#e8a0aa",
    ringColors: ["#fce4ec", "#f8bbd0", "#f48fb1"],
    icon: (
      <svg viewBox="0 0 80 80" width="56" height="56">
        <path
          d="M16 32 Q16 22 24 22 Q28 22 30 26 Q32 22 36 22 Q44 22 44 32 Q44 42 30 50 Q16 42 16 32Z"
          fill="#b22234"
        />
        <path
          d="M36 44 Q36 34 44 34 Q48 34 50 38 Q52 34 56 34 Q64 34 64 44 Q64 54 50 62 Q36 54 36 44Z"
          fill="#e85d8a"
          opacity="0.85"
        />
        <circle cx="40" cy="46" r="3" fill="#7a0e1e" />
      </svg>
    ),
  },
];

const PulseCircle = ({
  color,
  ringColors,
  icon,
  visible,
}: {
  color: string;
  ringColors: string[];
  icon: React.ReactNode;
  visible: boolean;
}) => (
  <div className="relative flex items-center justify-center w-[160px] h-[160px] md:w-[220px] md:h-[220px]">
    {ringColors.map((rc, i) => (
      <div
        key={i}
        className="absolute rounded-full w-[160px] h-[160px] md:w-[220px] md:h-[220px]"
        style={{
          background: rc,
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.6)",
          transition: `opacity 0.6s ease ${
            i * 0.15
          }s, transform 0.6s ease ${i * 0.15}s`,
          animation: visible
            ? `pulse-ring ${1.8 + i * 0.4}s ease-in-out ${
                i * 0.3
              }s infinite`
            : "none",
        }}
      />
    ))}

    <div
      className="absolute rounded-full w-[120px] h-[120px] md:w-[160px] md:h-[160px]"
      style={{ background: ringColors[1] }}
    />

    <div
      className="absolute rounded-full w-[80px] h-[80px] md:w-[110px] md:h-[110px]"
      style={{ background: ringColors[0] }}
    />

    <div
      className="absolute rounded-full bg-white shadow-lg flex items-center justify-center z-10 w-[60px] h-[60px] md:w-[80px] md:h-[80px]"
      style={{ boxShadow: `0 4px 24px ${color}55` }}
    >
      {icon}
    </div>
  </div>
);

const DashedConnector = ({
  fromLeft,
  visible,
}: {
  fromLeft: boolean;
  visible: boolean;
}) => (
  <div className="relative h-16 md:h-24 w-full overflow-visible">
    <svg
      viewBox="0 0 800 80"
      preserveAspectRatio="none"
      className="w-full h-full"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}
    >
      <path
        d={
          fromLeft
            ? "M 200 10 Q 400 80 600 10"
            : "M 600 10 Q 400 80 200 10"
        }
        fill="none"
        stroke="#b22234"
        strokeWidth="2"
        strokeDasharray="8 6"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  </div>
);

export default function HowItWorks() {
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  const [visibleConnectors, setVisibleConnectors] =
    useState<boolean[]>([false, false]);

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          STEPS.forEach((_, i) => {
            setTimeout(() => {
              setVisibleSteps((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * 350);
          });

          [0, 1].forEach((i) => {
            setTimeout(() => {
              setVisibleConnectors((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, (i + 1) * 500 + 200);
          });

          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.07);
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 0.9;
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="py-14 md:py-20 px-4 overflow-hidden relative"
        style={{ background: "#fdf5f5" }}
      >
        <div
          className="absolute top-1/2 left-1/2 w-52 h-52 md:w-64 md:h-64 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, #fce4ec 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* HEADER */}
        <div className="text-center mb-12 md:mb-16 relative z-10">
          <div className="inline-block mb-3">
            <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#b22234] uppercase bg-red-50 px-4 py-1.5 rounded-full border border-red-100">
              Simple Steps
            </span>
          </div>

          <h2
            className="text-3xl md:text-5xl font-black mb-4"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              color: "#7a0e1e",
            }}
          >
            How it works
          </h2>

          <p
            className="text-sm md:text-lg max-w-lg mx-auto leading-relaxed px-2"
            style={{ color: "#c97080" }}
          >
            At GetMarry, we&apos;re committed to supporting you on your
            journey to love and companionship.
          </p>
        </div>

        {/* STEPS */}
        <div className="max-w-4xl mx-auto relative z-10">
          {STEPS.map((step, i) => (
            <div key={step.number}>
              <div
                className={`
                  flex flex-col md:flex-row items-center gap-6 md:gap-16
                  ${
                    step.align === "right"
                      ? "md:flex-row-reverse"
                      : "md:flex-row"
                  }
                `}
              >
                {/* CIRCLE */}
                <div
                  className="shrink-0"
                  style={{
                    opacity: visibleSteps[i] ? 1 : 0,
                    transform: visibleSteps[i]
                      ? "scale(1)"
                      : "scale(0.7)",
                    transition:
                      "opacity 0.7s ease, transform 0.7s ease",
                  }}
                >
                  <PulseCircle
                    color={step.color}
                    ringColors={step.ringColors}
                    icon={step.icon}
                    visible={visibleSteps[i]}
                  />
                </div>

                {/* TEXT */}
                <div
                  className={`
                    flex-1 text-center md:text-left
                    ${
                      step.align === "right"
                        ? "md:text-right"
                        : "md:text-left"
                    }
                  `}
                  style={{
                    opacity: visibleSteps[i] ? 1 : 0,
                    transform: visibleSteps[i]
                      ? "translateX(0)"
                      : step.align === "right"
                      ? "translateX(40px)"
                      : "translateX(-40px)",
                    transition:
                      "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
                  }}
                >
                  <h3
                    className="text-2xl md:text-4xl font-black mb-3"
                    style={{
                      fontFamily:
                        "Georgia, 'Times New Roman', serif",
                      color: "#7a0e1e",
                    }}
                  >
                    {step.number}. {step.title}
                  </h3>

                  <p
                    className="text-sm md:text-base leading-relaxed max-w-sm mx-auto md:mx-0"
                    style={{ color: "#c97080" }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>

              {/* CONNECTOR */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block">
                  <DashedConnector
                    fromLeft={step.align === "left"}
                    visible={visibleConnectors[i]}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="text-center mt-12 md:mt-16 relative z-10"
          style={{
            opacity: visibleSteps[2] ? 1 : 0,
            transform: visibleSteps[2]
              ? "translateY(0)"
              : "translateY(20px)",
            transition:
              "opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s",
          }}
        >
          <button className="btn-primary px-7 md:px-10 py-3 md:py-4 rounded-2xl text-sm md:text-base cursor-pointer">
            💕 Get Started Free
          </button>
        </div>
      </section>
    </>
  );
}