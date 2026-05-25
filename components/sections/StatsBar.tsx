export default function StatusBar() {
  return (
    <section className="bg-white border-t border-b border-gray-100 py-8 px-4 lg:px-8">
      <div className="grid grid-cols-2 lg:flex lg:justify-around gap-6 lg:gap-0 items-center">
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
            icon: "❤️",
            value: "25",
            label: "YEARS OF EXPERIENCE",
          },
          {
            icon: "🕐",
            value: "24",
            label: "HOURS OF CUSTOMER SUPPORT",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 sm:gap-4"
          >
            <div
              className="w-14 h-14 lg:w-16 lg:h-16 rounded-full border-2 flex items-center justify-center text-xl lg:text-2xl shrink-0"
              style={{
                borderColor: "#c0174c",
                borderStyle: "dashed",
              }}
            >
              {stat.icon}
            </div>

            <div>
              <p className="text-2xl lg:text-3xl font-bold text-gray-800 leading-none">
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