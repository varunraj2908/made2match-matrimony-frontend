export default function StatusBar() {
  return (
    <section className="border-b border-rose-100 bg-[#fff8fa] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:px-6">
        {[
          {
            icon: "👤",
            value: "1000",
            label: "VERIFIED PROFILES",
          },
          {
            icon: "🛡️",
            value: "100%",
            label: "SECURITY",
          },
          {
            icon: "🤖",
            value: "AI",
            label: "POWERED MATCHING",
          },
          {
            icon: "🕐",
            value: "24",
            label: "HOURS OF CUSTOMER SUPPORT",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="flex min-h-28 flex-col items-center justify-center gap-3 rounded-2xl border border-rose-100 bg-white px-3 py-5 text-center shadow-[0_8px_30px_rgba(139,26,58,0.06)] transition-transform duration-300 hover:-translate-y-1 sm:flex-row sm:justify-start sm:px-5 sm:text-left"
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 bg-rose-50 text-xl lg:h-14 lg:w-14 lg:text-2xl"
              style={{
                borderColor: "#c0174c",
                borderStyle: "dashed",
              }}
            >
              {stat.icon}
            </div>

            <div>
              <p className="text-2xl font-bold leading-none text-[#17223b] lg:text-3xl">
                {stat.value}
              </p>

              <p className="text-[10px] lg:text-xs text-gray-500 tracking-widest uppercase mt-1">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
