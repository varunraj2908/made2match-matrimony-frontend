// import { cards } from "@/constants/cards";
// import { useEffect, useRef } from "react";

// export default function SuccessStories() {
//   const indexRef = useRef(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const cardElements =
//         document.querySelectorAll<HTMLElement>(".story-card-inner");

//       if (indexRef.current < cardElements.length) {
//         cardElements[indexRef.current].style.transform = "rotateY(180deg)";
//         indexRef.current++;
//       } else {
//         indexRef.current = 0;
//         cardElements.forEach((c) => (c.style.transform = "rotateY(0deg)"));
//       }
//     }, 900);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="px-8 py-8 bg-[##fdf5f5]">
//       <style>{`
//         .story-card-wrapper { perspective: 1000px; }
//         .story-card-inner { 
//           position: relative; 
//           width: 100%; 
//           height: 100%; 
//           min-height: 160px; 
//           transform-style: preserve-3d; 
//           transition: transform 0.7s ease; 
//         }
//         .story-card-front, .story-card-back { 
//           position: absolute; 
//           inset: 0; 
//           backface-visibility: hidden; 
//           -webkit-backface-visibility: hidden; 
//         }
//         .story-card-back { transform: rotateY(180deg); }
//       `}</style>

//       <h2 className="text-xl font-bold text-gray-800 tracking-widest uppercase mb-1">
//         Success Stories
//       </h2>

//       <div className="flex items-center gap-2 mb-6">
//         <div className="h-px w-6 bg-gray-300" />
//         <span className="text-[#c0174c] text-lg">♥</span>
//         <div className="h-px w-6 bg-gray-300" />
//       </div>

//       <div className="grid grid-cols-4 gap-0 border border-gray-200">
//         {cards.map((card, i) => (
//           <div key={i} className="story-card-wrapper" style={{ minHeight: 160 }}>
//             <div className="story-card-inner">
//               {/* Front */}
//               <div
//                 className="story-card-front flex flex-col"
//                 style={{
//                   background: card.type === "image" ? card.bg : "#c0174c",
//                 }}
//               >
//                 {card.type === "image" ? (
//                   <div className="relative flex-1 flex items-center justify-center p-4">
//                     <div className="absolute inset-0 bg-black/20" />
//                     <p
//                       className="text-white font-bold text-lg italic text-center z-10 whitespace-pre-line"
//                       style={{ fontFamily: "Georgia, serif" }}
//                     >
//                       {card.label}
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="p-4 flex flex-col gap-2 flex-1">
//                     <p className="text-white font-bold text-xs tracking-wide">
//                       {card.couple}
//                     </p>
//                     <p className="text-white/80 text-xs">{card.location}</p>
//                     <p className="text-white text-xs leading-relaxed flex-1">
//                       {card.quote}
//                     </p>
//                     <button className="self-start bg-[#8b1a3a] text-white text-xs px-3 py-1 rounded mt-1">
//                       More
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Back */}
//               <div
//                 className="story-card-back flex flex-col items-center justify-center gap-2 p-4"
//                 style={{
//                   background: card.type === "image" ? "#c0174c" : "#8b1a3a",
//                 }}
//               >
//                 <span className="text-white text-3xl">♥</span>
//                 <p className="text-white font-bold text-xs text-center">
//                   {card.couple || card.label}
//                 </p>
//                 <p className="text-white/75 text-xs text-center">
//                   {card.type === "text"
//                     ? "Now happily married!"
//                     : "Countless couples matched here ♥"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

import { cards } from "@/constants/cards";
import { useEffect, useRef } from "react";

export default function SuccessStories() {
  const indexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const cardElements =
        document.querySelectorAll<HTMLElement>(".story-card-inner");

      if (indexRef.current < cardElements.length) {
        cardElements[indexRef.current].style.transform = "rotateY(180deg)";
        indexRef.current++;
      } else {
        indexRef.current = 0;
        cardElements.forEach((c) => (c.style.transform = "rotateY(0deg)"));
      }
    }, 900);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="px-4 md:px-8 py-8 bg-[#fdf5f5]">
      <style>{`
        .story-card-wrapper { perspective: 1000px; }

        .story-card-inner { 
          position: relative; 
          width: 100%; 
          height: 100%; 
          min-height: 160px; 
          transform-style: preserve-3d; 
          transition: transform 0.7s ease; 
        }

        .story-card-front, .story-card-back { 
          position: absolute; 
          inset: 0; 
          backface-visibility: hidden; 
          -webkit-backface-visibility: hidden; 
          border-radius: 0;
        }

        .story-card-back { 
          transform: rotateY(180deg); 
        }
      `}</style>

      <h2 className="text-lg md:text-xl font-bold text-gray-800 tracking-widest uppercase mb-1 text-center md:text-left">
        Success Stories
      </h2>

      <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
        <div className="h-px w-6 bg-gray-300" />
        <span className="text-[#c0174c] text-lg">♥</span>
        <div className="h-px w-6 bg-gray-300" />
      </div>

      {/* MOBILE ONLY CHANGES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 border-0 lg:border lg:border-gray-200">
        {cards.map((card, i) => (
          <div
            key={i}
            className="story-card-wrapper"
            style={{ minHeight: 160 }}
          >
            <div className="story-card-inner">
              {/* Front */}
              <div
                className="story-card-front flex flex-col overflow-hidden shadow-md lg:shadow-none"
                style={{
                  background:
                    card.type === "image" ? card.bg : "#c0174c",
                }}
              >
                {card.type === "image" ? (
                  <div className="relative flex-1 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/20" />

                    <p
                      className="text-white font-bold text-base md:text-lg italic text-center z-10 whitespace-pre-line"
                      style={{
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {card.label}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <p className="text-white font-bold text-xs tracking-wide">
                      {card.couple}
                    </p>

                    <p className="text-white/80 text-xs">
                      {card.location}
                    </p>

                    <p className="text-white text-xs leading-relaxed flex-1">
                      {card.quote}
                    </p>

                    <button className="self-start bg-[#8b1a3a] text-white text-xs px-3 py-1 rounded mt-1">
                      More
                    </button>
                  </div>
                )}
              </div>

              {/* Back */}
              <div
                className="story-card-back flex flex-col items-center justify-center gap-2 p-4 overflow-hidden shadow-md lg:shadow-none"
                style={{
                  background:
                    card.type === "image"
                      ? "#c0174c"
                      : "#8b1a3a",
                }}
              >
                <span className="text-white text-3xl">♥</span>

                <p className="text-white font-bold text-xs text-center">
                  {card.couple || card.label}
                </p>

                <p className="text-white/75 text-xs text-center">
                  {card.type === "text"
                    ? "Now happily married!"
                    : "Countless couples matched here ♥"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}