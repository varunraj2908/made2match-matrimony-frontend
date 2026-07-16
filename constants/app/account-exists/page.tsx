"use client";
import { useRouter } from "next/navigation";

export default function AccountExistsPage() {
  const router = useRouter();

  const phone = "+91 8075067058";
  const profile = {
    name: "Varun",
    id: "MTM7086341",
    avatar: null,
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #f9f0f3 0%, #fdf4ff 100%)" }}>

      <div className="bg-white rounded-3xl shadow-xl px-10 py-10 max-w-md w-full text-center">

        {/* Logo / Icon */}
        <div className="flex justify-center mb-5">
          <div className="relative w-16 h-16">
            {/* Two-person circle icon */}
            <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shadow-md"
              style={{ background: "linear-gradient(135deg, #c0174c, #8b0f38)" }}>
              <svg viewBox="0 0 24 24" fill="white" className="w-9 h-9">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-black text-gray-900 mb-2">Account already exists</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6 px-2">
          You already have a profile registered with same mobile number{" "}
          <span className="font-bold text-gray-800">{phone}</span>.
        </p>

        {/* Profile Card */}
        <div className="flex items-center gap-4 px-4 py-4 rounded-2xl border-2 mb-6 text-left transition hover:shadow-md cursor-pointer"
          style={{ borderColor: "#c0174c", background: "#fff8f9" }}
          onClick={() => router.push("/login")}>
          {/* Avatar */}
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #fde8ef, #ffd6e0)" }}>
            <svg viewBox="0 0 24 24" fill="#c0174c" className="w-7 h-7">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm">{profile.name}</p>
            <p className="text-xs font-mono font-bold text-[#c0174c] mb-1">{profile.id}</p>
            <button
              className="flex items-center gap-0.5 text-xs font-semibold hover:underline transition"
              style={{ color: "#c0174c" }}
              onClick={e => { e.stopPropagation(); router.push("/login"); }}
            >
              Login to this profile
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => router.push("/register")}
          className="w-full py-3.5 rounded-2xl text-white font-bold text-sm tracking-wide transition-all hover:opacity-90 hover:scale-105 active:scale-95 shadow-lg"
          style={{
            background: "linear-gradient(135deg, #c0174c, #8b0f38)",
            boxShadow: "0 6px 20px rgba(192,23,76,0.35)",
          }}
        >
          Continue creating new account
        </button>

      </div>
    </div>
  );
}
