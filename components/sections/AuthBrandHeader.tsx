import Image from "next/image";

/** Transparent brand lockup for the splash-themed login & register screens. */
export default function AuthBrandHeader() {
  return (
    <div className="flex flex-col items-center text-center text-white pt-2">
      {/* Home-page logo on top */}
      <Image
        src="/golden-hearts.png"
        alt="Made2Match"
        width={140}
        height={96}
        priority
        className="h-24 w-auto object-contain drop-shadow"
      />
      {/* Brand name centered below the logo */}
      <span className="mt-3 text-3xl font-black" style={{ fontFamily: "Georgia, serif" }}>
        Made<span style={{ color: "#E8C547" }}>2</span>Match
      </span>
      <p className="mt-1.5 text-[11px] font-semibold tracking-[0.3em] text-white/85">
        INDIA&apos;S NO.1 MATRIMONY
      </p>
    </div>
  );
}
