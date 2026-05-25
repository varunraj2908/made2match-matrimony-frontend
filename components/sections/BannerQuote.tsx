import Image from "next/image";

export default function BannerQuote({ onClick }: { onClick: () => void }) {
  return (
    <section
      className="
        flex flex-col md:flex-row
        items-center justify-between
        gap-6 md:gap-8
        px-5 md:px-10
        pt-6 md:pt-4
        pb-6 md:pb-0
        overflow-hidden
        md:h-60
        relative
      "
      style={{
        background:
          "linear-gradient(135deg, #8b1a3a 0%, #c0174c 70%, #d4185a 100%)",
      }}
    >
      {/* LEFT COUPLE IMAGE */}
      <div
        className="
          relative
          h-40 w-40
          md:h-full md:w-50
          shrink-0
        "
      >
        <Image
          src="/romantic-couple.png"
          alt="couple"
          fill
          className="object-contain object-top"
        />
      </div>

      {/* TEXT */}
      <div
        className="
          flex flex-col
          items-center md:items-start
          text-center md:text-left
          gap-3
          max-w-md
          z-10
        "
      >
        <p
          className="
            text-white
            text-lg md:text-xl
            font-semibold
            leading-snug
          "
          style={{ fontFamily: "Georgia, serif" }}
        >
          It is true that marriages are made in heaven and life is too much
          boring without a life partner.
        </p>

        <button
          onClick={onClick}
          className="
            border border-white
            text-white
            font-bold
            text-xs
            tracking-widest
            px-5 py-2
            rounded-full
            hover:bg-white
            hover:text-[#c0174c]
            transition
            uppercase
            cursor-pointer
          "
        >
          Register Now
        </button>
      </div>

      {/* TRUMPET ICON */}
      <div className="hidden md:block shrink-0 text-4xl opacity-60 rotate-12">
        🎺
      </div>

      {/* RIGHT IMAGE */}
      <div
        className="
    hidden md:block
    relative
    md:h-92.5 md:w-92.5
    md:-right-35
    overflow-hidden
    shrink-0
  "
      >
        <Image
          src="/wedding-bg.webp"
          alt="wedding-bg"
          width={370}
          height={370}
          className="object-cover object-top rotate-320"
        />
      </div>
    </section>
  );
}
