export default function Footer() {
  return (
    <footer
      style={{ background: "#c0174c" }}
      className="px-4 md:px-8 py-8"
    >
      {/* TOP SECTION */}
      <div className="flex flex-col md:flex-row gap-10 md:gap-8">
        
        {/* QUICK LINKS */}
        <div className="flex-1">
          <h4 className="text-white font-bold text-base mb-4">
            Quick Links
          </h4>

          <div className="flex flex-col sm:flex-row gap-6 md:gap-8">
            <div className="flex flex-col gap-2">
              {[
                "Home",
                "Registration",
                "Member Login",
                "Partner Search",
                "Membership",
                "Astrology Guide",
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-white/80 hover:text-white text-xs transition border-b border-white/20 pb-1"
                >
                  {link}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              {[
                "Privacy Policy",
                "Contact Us",
                "About Us",
                "Terms & Conditions",
                "Success Story",
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-white/80 hover:text-white text-xs transition border-b border-white/20 pb-1"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* SUPPORT */}
        <div className="flex-1">
          <h4 className="text-white font-bold text-base mb-4">
            Help &amp; Support
          </h4>

          <div className="flex flex-col gap-3">
            {[
              { icon: "📞", text: "+91 12345 67890" },
              { icon: "📱", text: "+91 98765 43210" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center text-sm shrink-0">
                  {item.icon}
                </div>

                <span className="text-white/80 text-xs">
                  {item.text}
                </span>
              </div>
            ))}

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center text-sm shrink-0">
                ✉️
              </div>

              <div>
                <p className="text-white/80 text-xs">
                  getmarry@gmail.com
                </p>

                <p className="text-white/60 text-xs">
                  (And we will respond you right away)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CONTACT FORM */}
        <div className="flex-1">
          <h4 className="text-white font-bold text-base mb-4">
            Need Assistance
          </h4>

          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Name"
              className="bg-white/20 border border-white/30 rounded px-3 py-2 text-white placeholder-white/60 text-xs focus:outline-none focus:bg-white/30"
            />

            <input
              type="email"
              placeholder="Email"
              className="bg-white/20 border border-white/30 rounded px-3 py-2 text-white placeholder-white/60 text-xs focus:outline-none focus:bg-white/30"
            />

            <textarea
              placeholder="Message"
              rows={4}
              className="bg-white/20 border border-white/30 rounded px-3 py-2 text-white placeholder-white/60 text-xs focus:outline-none focus:bg-white/30 resize-none"
            />

            <button className="self-start bg-[#8b1a3a] hover:bg-[#6e1430] text-white font-bold px-8 py-2 rounded text-xs tracking-widest uppercase transition">
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="mt-6 pt-4 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/60 text-xs text-center md:text-left">
          © getmarry.com, all rights are reserved
        </p>

        <div className="flex gap-2">
          <button className="bg-[#3b5998] hover:bg-[#2d4373] text-white text-xs font-bold px-4 py-1.5 rounded flex items-center gap-1.5 transition">
            f Share
          </button>

          <button className="bg-[#1da1f2] hover:bg-[#0c85d0] text-white text-xs font-bold px-4 py-1.5 rounded flex items-center gap-1.5 transition">
            🐦 Tweet
          </button>
        </div>
      </div>
    </footer>
  );
}