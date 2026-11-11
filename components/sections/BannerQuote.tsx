import Image from "next/image";

export default function BannerQuote({ onClick }: { onClick: () => void }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#981a3d] via-[#b51649] to-[#d41459] md:h-60">

      <div className="relative z-10 h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-6 md:py-0">

        {/* LEFT — text */}
        <div className="flex flex-col gap-3 text-left max-w-md">
          <p
            className="text-lg font-semibold leading-snug text-white md:text-xl"
            style={{ fontFamily: "Georgia, serif" }}
          >
            It is true that marriages are made in heaven and life is too much
            boring without a life partner.
          </p>
          <div>
            <button
              type="button"
              onClick={onClick}
              className="btn-primary cursor-pointer rounded-full px-5 py-2 text-xs uppercase tracking-widest"
            >
              Register Now
            </button>
          </div>
        </div>

        {/* RIGHT — lady image */}
        <div className="hidden xl:block relative h-60 w-52 shrink-0">
          <Image
            src="/001 transparent.png"
            alt="Made2Match Lady"
            fill
            className="object-contain object-bottom"
            sizes="208px"
          />
        </div>

      </div>
    </section>
  );
}
