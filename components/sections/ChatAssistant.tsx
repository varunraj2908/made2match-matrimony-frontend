"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchProfiles, type SearchCriteria } from "@/services/searchService";
import { sendAssistantMessage, type AssistantApiProfile } from "@/services/assistantService";

type Action = { label: string; href: string };
type AssistantProfile = {
  id: number;
  name: string;
  age?: number;
  location?: string;
  profession?: string;
  photo?: string;
  href?: string; // navigation override (used for sample profiles)
};

// Fallback profiles shown when the API has no results / the user isn't logged in,
// so the chat always shows some profiles when asked.
const SAMPLE_PROFILES: AssistantProfile[] = [
  { id: -1, name: "Ananya Sharma", age: 28, location: "Bangalore", profession: "Software Engineer", photo: "/image1.jpg", href: "/search" },
  { id: -2, name: "Priya Nair", age: 27, location: "Kochi, Kerala", profession: "Doctor", photo: "/image3.jpg", href: "/search" },
  { id: -3, name: "Kavya Iyer", age: 26, location: "Chennai", profession: "Designer", photo: "/matrimony7.jpg", href: "/search" },
  { id: -4, name: "Sneha Patel", age: 29, location: "Ahmedabad", profession: "Chartered Accountant", photo: "/matrimony1.webp", href: "/search" },
];
type Msg = {
  role: "bot" | "user";
  text: string;
  actions?: Action[];
  profiles?: AssistantProfile[];
};

// Phrases that mean "show me real matches/profiles".
const MATCH_KEYS = [
  "match",          // matches, find matches, best matches, matches for me…
  "search",
  "bride",
  "groom",
  "browse",
  "profiles",       // show profiles, see profiles (plural — not "edit profile")
  "girl",
  "boy",
  "recommend",
  "suggest",
  "best profile",
  "show profile",
  "see profile",
  "top profile",
  "good profile",
];
const isMatchIntent = (t: string) => MATCH_KEYS.some((k) => t.includes(k));

// Cities we recognise in a query (lowercase match, displayed as-is).
const CITIES = [
  "Kochi", "Ernakulam", "Thiruvananthapuram", "Trivandrum", "Kozhikode", "Calicut",
  "Thrissur", "Kollam", "Kannur", "Kottayam", "Palakkad", "Malappuram", "Alappuzha",
  "Bangalore", "Bengaluru", "Chennai", "Mumbai", "Delhi", "Hyderabad", "Pune",
  "Kolkata", "Ahmedabad", "Jaipur", "Coimbatore", "Mysore", "Mangalore",
];

// Education keyword → stored qualification value.
const EDU_MAP: [string, string][] = [
  ["b.tech", "B.Tech"], ["btech", "B.Tech"], ["b tech", "B.Tech"],
  ["m.tech", "M.Tech"], ["mtech", "M.Tech"],
  ["mbbs", "MBBS"], ["mba", "MBA"],
  ["phd", "PhD"], ["doctorate", "PhD"],
  ["b.sc", "B.Sc"], ["bsc", "B.Sc"], ["m.sc", "M.Sc"], ["msc", "M.Sc"],
];

const capWord = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Map a backend profile to the chat card shape.
const mapApiProfile = (p: AssistantApiProfile): AssistantProfile => ({
  id: p.profileId,
  name: p.fullName || [p.firstName, p.lastName].filter(Boolean).join(" ") || "Member",
  age: p.age,
  location: [p.city, p.state].filter(Boolean).join(", "),
  profession: p.occupation,
  photo:
    p.profilePhotoUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(p.fullName || "?")}&background=c0174c&color=fff&size=120`,
});

// Extract search criteria (age, location, religion, education, horoscope) from free text.
const parseCriteria = (raw: string): { criteria: SearchCriteria; summary: string } => {
  const t = raw.toLowerCase();
  const c: SearchCriteria = {};
  const parts: string[] = [];
  let m: RegExpMatchArray | null;

  // Age
  if ((m = t.match(/(\d{2})\s*(?:-|to|and|–|until)\s*(\d{2})/))) {
    c.minAge = +m[1]; c.maxAge = +m[2]; parts.push(`age ${m[1]}–${m[2]}`);
  } else if ((m = t.match(/(?:below|under|less than|up\s?to|max)\s*(\d{2})/))) {
    c.maxAge = +m[1]; parts.push(`under ${m[1]}`);
  } else if ((m = t.match(/(?:above|over|more than|at\s?least|min)\s*(\d{2})/))) {
    c.minAge = +m[1]; parts.push(`above ${m[1]}`);
  } else if ((m = t.match(/age\s*(?:is\s*)?(\d{2})/))) {
    const a = +m[1]; c.minAge = a - 2; c.maxAge = a + 2; parts.push(`around ${a}`);
  }

  // Religion
  for (const r of ["hindu", "muslim", "christian", "sikh", "jain", "buddhist"]) {
    if (t.includes(r)) { c.religion = capWord(r); parts.push(c.religion); break; }
  }
  // Location
  for (const city of CITIES) {
    if (t.includes(city.toLowerCase())) { c.city = city; parts.push(`in ${city}`); break; }
  }
  // Education
  for (const [k, v] of EDU_MAP) {
    if (t.includes(k)) { c.education = v; parts.push(v); break; }
  }
  // Horoscope
  if (/horoscope|kundli|jathak|jadhag|nakshatra|raasi|star match/.test(t)) {
    c.withHoroscope = true; parts.push("with horoscope");
  }

  const summary = parts.length ? `Showing matches — ${parts.join(", ")} 💞` : "";
  return { criteria: c, summary };
};

const SUPPORT_PHONE = "+91 8075067058";

// Quick-reply chips shown under the greeting.
const QUICK_REPLIES = [
  "Show best matches",
  "Menu",
  "Complete my profile",
  "Upgrade membership",
  "Contact support",
];

// All the main pages — shown as a navigation menu inside the chat.
const NAV_LINKS: Action[] = [
  { label: "🏠 Home", href: "/home" },
  { label: "💞 Matches", href: "/profiles" },
  { label: "🔍 Search", href: "/search" },
  { label: "❤️ Interests", href: "/interests" },
  { label: "💬 Messages", href: "/chat" },
  { label: "🔔 Notifications", href: "/notifications" },
  { label: "👤 Edit Profile", href: "/edit-profile" },
  { label: "✨ Partner Preferences", href: "/partnerpreferences" },
  { label: "⭐ Membership", href: "/specialoffer" },
  { label: "⚙️ Settings", href: "/settings" },
  { label: "❓ Help", href: "/help" },
];

// Keyword → reply rules. First matching rule wins.
const RULES: { keys: string[]; reply: () => Msg }[] = [
  {
    keys: ["menu", "navigation", "navigate", "pages", "page", "go to", "links", "where can", "where do", "sections", "explore", "options"],
    reply: () => ({
      role: "bot",
      text: "Here's everything — tap to go anywhere 👇",
      actions: NAV_LINKS,
    }),
  },
  {
    keys: ["hi", "hello", "hey", "namaste", "start"],
    reply: () => ({
      role: "bot",
      text: "Hi! 👋 I'm your Made2Match assistant. I can help you find matches, complete your profile, manage your account and more. Type \"menu\" to jump anywhere.",
    }),
  },
  {
    keys: ["find", "match", "search", "bride", "groom", "partner profile", "browse"],
    reply: () => ({
      role: "bot",
      text: "You can search profiles by age, height, religion, education and more. Want me to open Search?",
      actions: [{ label: "Open Search", href: "/search" }],
    }),
  },
  {
    keys: ["preference", "partner pref", "criteria", "what i want"],
    reply: () => ({
      role: "bot",
      text: "Set who you're looking for in Partner Preferences — age, religion, education, location and lifestyle. Better preferences mean better matches.",
      actions: [{ label: "Edit Preferences", href: "/partnerpreferences" }],
    }),
  },
  {
    keys: ["photo", "picture", "image", "dp", "upload"],
    reply: () => ({
      role: "bot",
      text: "Profiles with photos get many more responses! You can add or change photos from your profile page.",
      actions: [{ label: "Add Photos", href: "/edit-profile" }],
    }),
  },
  {
    keys: ["profile", "complete", "edit", "about", "bio", "details"],
    reply: () => ({
      role: "bot",
      text: "Keep your profile complete and up to date — it helps you appear in more searches. You can edit your details, photos and 'About me' here.",
      actions: [{ label: "Edit Profile", href: "/edit-profile" }],
    }),
  },
  {
    keys: ["interest", "express", "connect", "like", "request"],
    reply: () => ({
      role: "bot",
      text: "To connect with someone, open their profile and tap 'Send Interest'. If they accept, you can start chatting. You can track these under Matches.",
      actions: [{ label: "Browse Matches", href: "/profiles" }],
    }),
  },
  {
    keys: ["upgrade", "premium", "member", "plan", "price", "pricing", "payment", "pay", "subscribe"],
    reply: () => ({
      role: "bot",
      text: "Premium membership lets you call & message your matches directly and boosts your visibility. See the plans and offers here.",
      actions: [{ label: "View Plans", href: "/specialoffer" }],
    }),
  },
  {
    keys: ["message", "chat", "talk", "conversation", "reply"],
    reply: () => ({
      role: "bot",
      text: "You can message members you've matched with from the Messages section. (Direct messaging needs a premium membership.)",
      actions: [
        { label: "Open Messages", href: "/chat" },
        { label: "Upgrade", href: "/specialoffer" },
      ],
    }),
  },
  {
    keys: ["password", "email", "account", "setting", "logout", "deactivate", "security"],
    reply: () => ({
      role: "bot",
      text: "You can change your email or password, manage privacy and deactivate your profile from Settings.",
      actions: [{ label: "Open Settings", href: "/settings" }],
    }),
  },
  {
    keys: ["notification", "alert", "viewed", "shortlist"],
    reply: () => ({
      role: "bot",
      text: "Your notifications show who viewed or shortlisted you, interests received and new matches. The bell icon at the top shows unread ones.",
      actions: [{ label: "View Notifications", href: "/notifications" }],
    }),
  },
  {
    keys: ["horoscope", "astrology", "star", "raasi", "kundli", "nakshatra"],
    reply: () => ({
      role: "bot",
      text: "You can add your horoscope / star details to your profile for better astrological matching.",
      actions: [{ label: "Add Horoscope", href: "/horoscope" }],
    }),
  },
  {
    keys: ["register", "signup", "sign up", "join", "create account"],
    reply: () => ({
      role: "bot",
      text: "New here? Create a free profile to get started — it only takes a couple of minutes.",
      actions: [{ label: "Register Free", href: "/registration" }],
    }),
  },
  {
    keys: ["help", "support", "contact", "phone", "call", "agent", "human"],
    reply: () => ({
      role: "bot",
      text: `Our team is happy to help. Call us at ${SUPPORT_PHONE}, or visit the Help centre to chat with us.`,
      actions: [{ label: "Help Centre", href: "/help" }],
    }),
  },
  {
    keys: ["thanks", "thank", "great", "cool", "ok", "okay"],
    reply: () => ({
      role: "bot",
      text: "You're welcome! 😊 Is there anything else I can help you with?",
    }),
  },
];

const getReply = (text: string): Msg => {
  const t = text.toLowerCase();
  const rule = RULES.find((r) => r.keys.some((k) => t.includes(k)));
  if (rule) return rule.reply();
  return {
    role: "bot",
    text: "I'm not sure about that one, but I can help with finding matches, your profile, photos, membership, settings and more. You can also reach our team for anything else.",
    actions: [{ label: "Contact Support", href: "/help" }],
  };
};

export default function ChatAssistant() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Parse criteria from the user's text, fetch matching profiles, show cards.
  const showMatches = (rawText: string) => {
    const { criteria, summary } = parseCriteria(rawText);
    setTyping(true);
    searchProfiles({ sortBy: "profile_score", ...criteria }, 0, 5)
      .then((res) => {
        setTyping(false);
        if (!res.items.length) {
          setMessages((m) => [
            ...m,
            {
              role: "bot",
              text: summary
                ? "No exact matches for that — here are some popular profiles 💞"
                : "Here are some popular profiles you might like 💞",
              profiles: SAMPLE_PROFILES,
              actions: [{ label: "Refine in Search", href: "/search" }],
            },
          ]);
          return;
        }
        setMessages((m) => [
          ...m,
          {
            role: "bot",
            text: summary || `Here are ${res.items.length} top matches for you 💞`,
            profiles: res.items.map((p) => ({
              id: p.id,
              name: p.name,
              age: p.age,
              location: p.location,
              profession: p.profession,
              photo: p.photo,
            })),
            actions: [{ label: "See all matches", href: "/search" }],
          },
        ]);
      })
      .catch(() => {
        setTyping(false);
        setMessages((m) => [
          ...m,
          {
            role: "bot",
            text: "Here are a few profiles you might like 💞 — log in to see your personalised matches.",
            profiles: SAMPLE_PROFILES,
            actions: [{ label: "Open Search", href: "/search" }],
          },
        ]);
      });
  };

  // Greet on first open (profiles are only shown when the user asks).
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "bot",
          text: "Hi! 👋 I'm your Made2Match assistant. Ask me to \"show best profiles\", type \"menu\" to navigate, or ask me anything below.",
        },
      ]);
    }
  }, [open, messages.length]);

  // Auto-scroll to the latest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);

    // Primary path: the backend assistant (intent + live matches + actions).
    sendAssistantMessage(trimmed)
      .then((res) => {
        setTyping(false);
        const profiles = (res.profiles ?? []).map(mapApiProfile);
        setMessages((m) => [
          ...m,
          {
            role: "bot",
            text: res.reply || "…",
            profiles: profiles.length ? profiles : undefined,
            actions: res.actions && res.actions.length ? res.actions : undefined,
          },
        ]);
      })
      .catch(() => {
        // Offline fallback: built-in rules so the chat still works if the API is unreachable.
        setTyping(false);
        if (isMatchIntent(trimmed.toLowerCase())) {
          showMatches(trimmed);
        } else {
          setMessages((m) => [...m, getReply(trimmed)]);
        }
      });
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat assistant"
        className="fixed bottom-20 lg:bottom-5 right-5 z-[1400] w-14 h-14 rounded-full text-white shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        style={{ background: "linear-gradient(135deg,#c0174c,#8b0f38)" }}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 9h10v2H7V9zm6 5H7v-2h6v2zm4-6H7V6h10v2z" />
          </svg>
        )}
        {!open && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-36 lg:bottom-24 right-5 z-[1400] w-[92vw] max-w-sm h-[70vh] max-h-[560px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-3 text-white shrink-0" style={{ background: "linear-gradient(135deg,#c0174c,#8b0f38)" }}>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">💞</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm leading-tight">Match Assistant</p>
              <p className="text-[11px] text-white/80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> Online
              </p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-[#fdf5f7]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`${m.profiles ? "max-w-[92%] w-full" : "max-w-[82%]"} ${m.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1.5`}>
                  <div
                    className={`px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl ${
                      m.role === "user"
                        ? "text-white rounded-br-sm"
                        : "bg-white text-gray-700 border border-gray-100 rounded-bl-sm shadow-sm"
                    }`}
                    style={m.role === "user" ? { background: "linear-gradient(135deg,#c0174c,#8b0f38)" } : undefined}
                  >
                    {m.text}
                  </div>

                  {/* Real match cards */}
                  {m.profiles && m.profiles.length > 0 && (
                    <div className="flex flex-col gap-2 w-full">
                      {m.profiles.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => { setOpen(false); router.push(p.href ?? `/profiles/${p.id}`); }}
                          className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-xl p-2 shadow-sm text-left transition-all hover:border-[#c0174c]/40 hover:shadow-md"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.photo} alt={p.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-800 truncate">{p.name}</p>
                            <p className="text-[11px] text-gray-500 truncate">
                              {[p.age ? `${p.age} yrs` : null, p.location].filter(Boolean).join(" · ") || "—"}
                            </p>
                            {p.profession && <p className="text-[10px] text-[#c0174c] truncate">{p.profession}</p>}
                          </div>
                          <span className="text-[#c0174c] text-sm shrink-0">→</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {m.actions && m.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.actions.map((a) => (
                        <button
                          key={a.href + a.label}
                          onClick={() => { setOpen(false); router.push(a.href); }}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors hover:bg-[#c0174c] hover:text-white"
                          style={{ borderColor: "#c0174c", color: "#c0174c" }}
                        >
                          {a.label} →
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm px-3.5 py-3 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "120ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "240ms" }} />
                </div>
              </div>
            )}

            {/* Quick replies (only before the user has typed anything) */}
            {messages.length <= 1 && !typing && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-[#c0174c]/30 text-[#c0174c] hover:bg-[#c0174c] hover:text-white transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="p-2.5 border-t border-gray-100 bg-white flex items-center gap-2 shrink-0"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0174c]"
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={!input.trim()}
              className="w-10 h-10 rounded-full text-white flex items-center justify-center shrink-0 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#c0174c,#8b0f38)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
