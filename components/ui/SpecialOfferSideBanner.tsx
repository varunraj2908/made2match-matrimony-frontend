"use client";

interface SpecialOfferSideBannerProps {
  onClick: () => void;
}

export default function SpecialOfferSideBanner({ onClick }: SpecialOfferSideBannerProps) {
  return (
    <div className="w-full flex justify-center bg-white pb-3">
      <button
        type="button"
        onClick={onClick}
        aria-label="View Special Offer"
        className="cursor-pointer group focus:outline-none relative"
        style={{ width: "190px" }}
      >
        {/* ── 3D depth layer (back face — darkest) ── */}
        <div
          className="absolute"
          style={{
            top: "6px",
            left: "4px",
            right: "4px",
            height: "52px",
            background: "#5a0610",
            borderRadius: "2px",
            zIndex: 0,
          }}
        />

        {/* ── Mid shadow layer ── */}
        <div
          className="absolute"
          style={{
            top: "3px",
            left: "2px",
            right: "2px",
            height: "52px",
            background: "#8b0b18",
            borderRadius: "2px",
            zIndex: 1,
          }}
        />

        {/* ── Main red ribbon body (top face) ── */}
        <div
          className="relative flex items-center justify-center transition-all duration-200
                     group-hover:-translate-y-0.5 group-hover:brightness-110
                     active:translate-y-0.5 active:brightness-95"
          style={{
            background:
              "linear-gradient(180deg, #ff2d44 0%, #e8192c 35%, #c0112a 65%, #9a0e22 100%)",
            height: "52px",
            width: "100%",
            borderRadius: "2px",
            zIndex: 2,
            boxShadow:
              "0 2px 0 #8b0b18, 0 4px 0 #5a0610, 0 6px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)",
          }}
        >
          {/* Top gloss shine */}
          <div
            className="absolute inset-x-0 top-0 rounded-t pointer-events-none"
            style={{
              height: "45%",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.04) 100%)",
            }}
          />

          {/* Bottom inner shadow */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: "30%",
              background:
                "linear-gradient(0deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 100%)",
            }}
          />

          {/* Embossed text */}
          <div className="relative z-10 text-center leading-tight select-none">
            <p
              className="font-black text-white uppercase tracking-widest"
              style={{
                fontSize: "16px",
                textShadow:
                  "0 1px 0 rgba(255,255,255,0.15), 0 -1px 0 rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.5)",
                letterSpacing: "0.18em",
              }}
            >
              SPECIAL
            </p>
            <p
              className="font-black text-white uppercase tracking-widest"
              style={{
                fontSize: "16px",
                textShadow:
                  "0 1px 0 rgba(255,255,255,0.15), 0 -1px 0 rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.5)",
                letterSpacing: "0.18em",
              }}
            >
              OFFER
            </p>
          </div>
        </div>

        {/* ── Left curl tab (3D folded ear) ── */}
        <div
          className="absolute"
          style={{
            top: "4px",
            left: "-11px",
            width: "14px",
            height: "42px",
            zIndex: 2,
            background:
              "linear-gradient(90deg, #7a0d1a 0%, #a50f20 40%, #c0112a 100%)",
            clipPath:
              "polygon(100% 0%, 100% 100%, 20% 88%, 0% 65%, 0% 35%, 20% 12%)",
            boxShadow: "-3px 3px 8px rgba(0,0,0,0.45)",
          }}
        />
        {/* Left ear inner highlight */}
        <div
          className="absolute"
          style={{
            top: "10px",
            left: "-6px",
            width: "5px",
            height: "28px",
            zIndex: 3,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 100%)",
            clipPath:
              "polygon(100% 0%, 100% 100%, 0% 85%, 0% 15%)",
          }}
        />

        {/* ── Right curl tab (3D folded ear) ── */}
        <div
          className="absolute"
          style={{
            top: "4px",
            right: "-11px",
            width: "14px",
            height: "42px",
            zIndex: 2,
            background:
              "linear-gradient(90deg, #c0112a 0%, #a50f20 60%, #7a0d1a 100%)",
            clipPath:
              "polygon(0% 0%, 80% 12%, 100% 35%, 100% 65%, 80% 88%, 0% 100%)",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.45)",
          }}
        />
        {/* Right ear inner highlight */}
        <div
          className="absolute"
          style={{
            top: "10px",
            right: "-6px",
            width: "5px",
            height: "28px",
            zIndex: 3,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%)",
            clipPath:
              "polygon(0% 0%, 100% 15%, 100% 85%, 0% 100%)",
          }}
        />

        {/* ── Bottom-left fold triangle ── */}
        <div
          className="absolute"
          style={{
            bottom: "-10px",
            left: 0,
            width: 0,
            height: 0,
            zIndex: 1,
            borderStyle: "solid",
            borderWidth: "10px 14px 0 0",
            borderColor: "#3d0209 transparent transparent transparent",
            filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.4))",
          }}
        />

        {/* ── Bottom-right fold triangle ── */}
        <div
          className="absolute"
          style={{
            bottom: "-10px",
            right: 0,
            width: 0,
            height: 0,
            zIndex: 1,
            borderStyle: "solid",
            borderWidth: "10px 0 0 14px",
            borderColor: "#3d0209 transparent transparent transparent",
            filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.4))",
          }}
        />
      </button>
    </div>
  );
}
