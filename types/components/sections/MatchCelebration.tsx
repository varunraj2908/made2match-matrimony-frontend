"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyProfile } from "@/services/homeService";
import ConfettiCanvas from "./ConfettiCanvas";
import { useScrollLock } from "@/lib/useScrollLock";
import {
  MATCH_CELEBRATE_EVENT,
  type MatchCelebrationDetail,
} from "@/lib/celebrate";

const fallbackAvatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "?")}&background=c0174c&color=fff&size=200`;

const SPRING = "cubic-bezier(0.34,1.56,0.64,1)";

export default function MatchCelebration() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [partner, setPartner] = useState<MatchCelebrationDetail | null>(null);
  const [myPhoto, setMyPhoto] = useState<string>("");

  // Listen for match events.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<MatchCelebrationDetail>).detail;
      if (!detail?.name) return;
      setPartner(detail);
      setOpen(true);
      if (!myPhoto) {
        getMyProfile()
          .then((p) => setMyPhoto(p.profilePhotoUrl || ""))
          .catch(() => undefined);
      }
    };
    window.addEventListener(MATCH_CELEBRATE_EVENT, handler);
    return () => window.removeEventListener(MATCH_CELEBRATE_EVENT, handler);
  }, [myPhoto]);

  // Lock background scroll (no page jump) while celebrating.
  useScrollLock(open);

  if (!open || !partner) return null;

  const close = () => setOpen(false);
  const goMessages = () => {
    close();
    router.push("/chat");
  };
  const viewProfile = () => {
    close();
    if (partner.profileId) router.push(`/profiles/${partner.profileId}`);
  };

  return (
    <div
      className="fixed inset-0 z-[1800] flex items-center justify-center p-4 overflow-hidden"
      style={{ background: "rgba(60,8,28,0.72)", backdropFilter: "blur(3px)" }}
      onClick={close}
    >
      <ConfettiCanvas />

      <div
        className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden text-center"
        style={{ animation: `m2m-slideUp 0.5s ${SPRING} both` }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full text-gray-400 hover:bg-gray-100 flex items-center justify-center"
        >
          ✕
        </button>

        <div className="pt-8 pb-6 px-6" style={{ background: "linear-gradient(135deg,#fde4ec,#ffffff)" }}>
          {/* Avatars */}
          <div className="flex items-center justify-center mb-5">
            <img
              src={myPhoto || fallbackAvatar("You")}
              alt="You"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg -mr-3"
              style={{ animation: `m2m-avatarLeft 0.5s 0.2s ${SPRING} both` }}
              onError={(e) => { (e.target as HTMLImageElement).src = fallbackAvatar("You"); }}
            />
            <div className="relative flex items-center justify-center z-10">
              <span className="absolute w-12 h-12 rounded-full border-2 border-[#c0174c] animate-ping opacity-60" />
              <div
                className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center"
                style={{ animation: `m2m-heartPop 0.6s 0.5s ${SPRING} both` }}
              >
                <span className="text-[#c0174c] text-2xl leading-none">❤</span>
              </div>
            </div>
            <img
              src={partner.photo || fallbackAvatar(partner.name)}
              alt={partner.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg -ml-3"
              style={{ animation: `m2m-avatarRight 0.5s 0.3s ${SPRING} both` }}
              onError={(e) => { (e.target as HTMLImageElement).src = fallbackAvatar(partner.name); }}
            />
          </div>

          <h2 className="text-2xl font-black tracking-tight" style={{ color: "#c0174c", animation: "m2m-fadeIn 0.4s 0.7s both" }}>
            It&apos;s a Match! 💞
          </h2>
          <p className="text-sm text-gray-500 mt-1" style={{ animation: "m2m-fadeIn 0.4s 0.8s both" }}>
            You and <span className="font-semibold text-gray-700">{partner.name}</span> both liked each other
          </p>
        </div>

        <div className="px-6 pb-6 pt-3 flex flex-col gap-2.5" style={{ animation: "m2m-fadeIn 0.4s 0.95s both" }}>
          <button
            onClick={goMessages}
            className="w-full py-3 rounded-full text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg,#c0174c,#8b0f38)", boxShadow: "0 8px 20px rgba(192,23,76,0.35)" }}
          >
            💬 Send a Message
          </button>
          <button
            onClick={viewProfile}
            className="w-full py-3 rounded-full text-sm font-semibold text-[#c0174c] border border-[#c0174c]/30 hover:bg-[#fde4ec] transition-colors"
          >
            View Profile
          </button>
          <button onClick={close} className="text-xs text-gray-400 hover:text-gray-600 mt-1">
            Maybe later
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes m2m-slideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes m2m-avatarLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes m2m-avatarRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes m2m-heartPop {
          0%   { transform: scale(0) rotate(-20deg); }
          60%  { transform: scale(1.3) rotate(8deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes m2m-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
