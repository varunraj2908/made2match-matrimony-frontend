

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Nav Items (notification removed) ────────────────────────────────────────
const NAV_ITEMS = [
  {
    id: "home",
    label: "Home",
    href: "/home",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    id: "matches",
    label: "Matches",
    href: "/profiles",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
  {
    id: "interests",
    label: "Interests",
    href: "/interests",
    badge: 9,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
  },
  {
    id: "chat",
    label: "Messages",
    href: "/chat",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      </svg>
    ),
  },
  {
    id: "search",
    label: "Search",
    href: "/search",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
];

// ─── Notifications Data ───────────────────────────────────────────────────────
const NOTIFICATIONS = [
  {
    id: 1,
    type: "interest",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Priya Sharma",
    message: "sent you an interest",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    type: "view",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Anjali Nair",
    message: "viewed your profile",
    time: "15 min ago",
    unread: true,
  },
  {
    id: 3,
    type: "message",
    photo: "https://randomuser.me/api/portraits/women/32.jpg",
    name: "Meera Pillai",
    message: "sent you a message",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 4,
    type: "match",
    photo: "https://randomuser.me/api/portraits/women/55.jpg",
    name: "Deepa Thomas",
    message: "is a new match for you!",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 5,
    type: "interest",
    photo: "https://randomuser.me/api/portraits/women/17.jpg",
    name: "Lakshmi Menon",
    message: "accepted your interest",
    time: "3 hours ago",
    unread: false,
  },
  {
    id: 6,
    type: "view",
    photo: "https://randomuser.me/api/portraits/women/72.jpg",
    name: "Nithya Krishnan",
    message: "viewed your profile",
    time: "5 hours ago",
    unread: false,
  },
  {
    id: 7,
    type: "message",
    photo: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "Sreeja Varma",
    message: "replied to your message",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 8,
    type: "match",
    photo: "https://randomuser.me/api/portraits/women/61.jpg",
    name: "Divya Nambiar",
    message: "is a new match for you!",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 9,
    type: "interest",
    photo: "https://randomuser.me/api/portraits/women/74.jpg",
    name: "Arya Menon",
    message: "sent you an interest",
    time: "2 days ago",
    unread: false,
  },
  {
    id: 10,
    type: "view",
    photo: "https://randomuser.me/api/portraits/women/45.jpg",
    name: "Resmi Pillai",
    message: "viewed your profile",
    time: "2 days ago",
    unread: false,
  },
  {
    id: 11,
    type: "message",
    photo: "https://randomuser.me/api/portraits/women/46.jpg",
    name: "Fathima Beevi",
    message: "sent you a message",
    time: "3 days ago",
    unread: false,
  },
  {
    id: 12,
    type: "match",
    photo: "https://randomuser.me/api/portraits/women/48.jpg",
    name: "Sneha Thomas",
    message: "is a new match for you!",
    time: "3 days ago",
    unread: false,
  },
];

const NOTIF_ICONS: Record<string, { icon: string; color: string; bg: string }> =
  {
    interest: { icon: "💞", color: "#e85d8a", bg: "#ffeaf2" },
    view:     { icon: "👁️", color: "#3db9d4", bg: "#e4f8fc" },
    message:  { icon: "💬", color: "#f0a500", bg: "#fff8e1" },
    match:    { icon: "❤️", color: "#b22234", bg: "#ffeaea" },
  };

export default function Navbar() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("home");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [, setShowSwitchMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const menuRef        = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef  = useRef<HTMLDivElement | null>(null);
  const notifRef       = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setShowMobileMenu(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const displayed =
    activeTab === "unread"
      ? notifications.filter((n) => n.unread)
      : notifications;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  const markRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );

  const isLoggedIn = true;

  const totalBadgeCount =
    notifications.filter((n) => n.unread).length +
    (NAV_ITEMS.find((i) => i.id === "interests")?.badge || 0);

  /* ── Shared Notification Panel ── */
  const NotificationPanel = () => (
    <div
  className="fixed left-0 right-0 top-16 lg:absolute lg:left-auto lg:right-0 lg:top-full mt-0 lg:mt-3.5 bg-white lg:w-90 w-full shadow-2xl z-50 overflow-hidden"
  style={{ border: "1px solid #fce4ec" }}
>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-red-50">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-black text-gray-800">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-[#b22234] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <button
          onClick={markAllRead}
          className="text-[10px] font-semibold text-[#b22234] hover:underline"
        >
          Mark all read
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-red-50">
        {(["all", "unread"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-bold capitalize transition-colors ${
              activeTab === tab
                ? "text-[#b22234] border-b-2 border-[#b22234]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab === "all"
              ? `All (${notifications.length})`
              : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* Scrollable list */}
      <div className="overflow-y-auto" style={{ maxHeight: 340 }}>
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-300">
            <span style={{ fontSize: 32 }}>🔔</span>
            <p className="text-xs mt-2">No unread notifications</p>
          </div>
        ) : (
          displayed.map((notif) => {
            const meta = NOTIF_ICONS[notif.type];
            return (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${
                  notif.unread
                    ? "bg-[#fff9f9] hover:bg-[#fdf2f3]"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={notif.photo}
                    alt={notif.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/40?text=?";
                    }}
                  />
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] border-2 border-white"
                    style={{ background: meta.bg }}
                  >
                    {meta.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-800 leading-relaxed">
                    <span className="font-bold">{notif.name}</span>{" "}
                    <span className="text-gray-500">{notif.message}</span>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{notif.time}</p>
                </div>
                {notif.unread && (
                  <span
                    className="shrink-0 w-2 h-2 rounded-full mt-1"
                    style={{ background: "#b22234" }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-red-50 bg-gray-50">
        <button className="w-full text-xs font-bold text-[#b22234] hover:underline text-center">
          View all notifications →
        </button>
      </div>
    </div>
  );

  return (
    <header className="w-full bg-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* ─────────────────────────────────────────────────
              MOBILE — Hamburger (left)
          ───────────────────────────────────────────────── */}
          {isLoggedIn && (
            <div className="flex lg:hidden" ref={mobileMenuRef}>
              <button
                onClick={() => {
                  setShowMobileMenu((prev) => !prev);
                  setShowUserMenu(false);
                  setShowNotifications(false);
                }}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl text-gray-600 hover:text-[#b22234] hover:bg-red-50 transition-all"
                aria-label="Open menu"
              >
                {showMobileMenu ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
                {/* {totalBadgeCount > 0 && !showMobileMenu && (
                  <span className="absolute top-1 right-1 bg-[#b22234] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {totalBadgeCount > 9 ? "9+" : totalBadgeCount}
                  </span>
                )} */}
              </button>

              {/* Mobile Dropdown Menu */}
              {showMobileMenu && (
                <div
                  className="absolute left-0 top-16 w-full bg-white shadow-2xl z-50"
                  style={{ borderRight: "1px solid #fce4ec", borderBottom: "1px solid #fce4ec" }}
                >
                  <div className="px-4 py-3 border-b border-red-50 bg-[#fff9f9]">
                    <p className="text-xs font-black text-[#b22234] uppercase tracking-wider">
                      Navigation
                    </p>
                  </div>
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => {
                        setActiveNav(item.id);
                        setShowMobileMenu(false);
                        setShowNotifications(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors border-b border-gray-50 last:border-0 ${
                        activeNav === item.id
                          ? "text-[#b22234] bg-red-50"
                          : "text-gray-600 hover:bg-red-50 hover:text-[#b22234]"
                      }`}
                    >
                      <span className="relative">
                        {item.icon}
                        {item.badge && (
                          <span className="absolute -top-1.5 -right-2 bg-[#b22234] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                            {item.badge}
                          </span>
                        )}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="bg-[#ffeaea] text-[#b22234] text-[10px] font-black px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────
              LOGO — centered on mobile, left on desktop
          ───────────────────────────────────────────────── */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
          >
            <div className="flex flex-col leading-none">
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-black" style={{ color: "#b22234", fontFamily: "Georgia, serif" }}>
                  Made
                </span>
                <span className="text-2xl font-bold" style={{ color: "#f3e228" }}>
                  2
                </span>
                <span className="text-2xl font-black" style={{ color: "#b22234", fontFamily: "Georgia, serif" }}>
                  Match
                </span>
              </div>
            </div>
          </Link>

          {/* ─────────────────────────────────────────────────
              DESKTOP Center Nav
          ───────────────────────────────────────────────── */}
          {isLoggedIn ? (
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    setActiveNav(item.id);
                    setShowNotifications(false);
                  }}
                  className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all group ${
                    activeNav === item.id
                      ? "text-[#b22234]"
                      : "text-gray-500 hover:text-[#b22234]"
                  }`}
                >
                  {activeNav === item.id && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#b22234]" />
                  )}
                  <span className="relative">
                    {item.icon}
                    {item.badge && (
                      <span className="absolute -top-1.5 -right-2 bg-[#b22234] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] font-semibold leading-none">
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
          ) : (
            <p className="text-sm text-gray-400 italic hidden lg:block">
              Let&apos;s Get Married
            </p>
          )}

          {/* ─────────────────────────────────────────────────
              RIGHT SIDE — Notification Bell + Profile Avatar
          ───────────────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                {/* ── Notification Bell (next to avatar, both mobile & desktop) ── */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => {
                      setShowNotifications((prev) => !prev);
                      setShowUserMenu(false);
                      setShowMobileMenu(false);
                    }}
                    className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all ${
                      showNotifications
                        ? "text-[#b22234] bg-red-50"
                        : "text-gray-500 hover:text-[#b22234] hover:bg-red-50"
                    }`}
                    aria-label="Notifications"
                  >
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 bg-[#b22234] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification dropdown panel */}
                  {showNotifications && <NotificationPanel />}
                </div>

                {/* ── Profile Avatar ── */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => {
                      setShowUserMenu((prev) => !prev);
                      setShowMobileMenu(false);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-1 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#f5d0d7] hover:border-[#b22234] transition-colors">
                      <img
                        src="https://i.pravatar.cc/300?img=33"
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                    {/* <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="#999"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      className="group-hover:stroke-[#b22234] transition-colors"
                      style={{
                        transform: showUserMenu ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    >
                      <path d="M2 4l4 4 4-4" />
                    </svg> */}
                  </button>

                  {showUserMenu && (
                    <div className="fixed inset-x-0 top-16 md:absolute md:inset-auto md:right-0 md:top-12.5 w-full md:w-96 bg-white border border-gray-100 shadow-xl py-2 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-sm font-bold text-gray-800">Rahul Sharma</p>
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: "#fff0f4", color: "#c0174c", border: "1px solid #f9c8d6" }}
                          >
                            Free
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">GM002341 • Kerala</p>
                      </div>

                      {/* Upgrade Banner */}
                      <div
                        className="mx-3 my-2 rounded-xl px-3 py-2.5 text-center"
                        style={{ background: "#fff8f9", border: "1px solid #f5c0cc" }}
                      >
                        <p className="text-xs text-gray-600 mb-2 leading-snug">
                          Upgrade membership to call or message with matches
                        </p>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            router.push("/specialoffer");
                          }}
                          className="w-full py-2 cursor-pointer rounded-lg text-white text-xs font-bold tracking-wide hover:opacity-90 active:scale-95 transition-all"
                          style={{ background: "linear-gradient(135deg, #c0174c, #8b0f38)" }}
                        >
                          Upgrade now
                        </button>
                      </div>

                      {/* Nav Links */}
                      {[
                        { label: "Edit Profile",             icon: "👤", href: "/edit-profile" },
                        { label: "Edit Partner preferences", icon: "✏️", href: "/partnerpreferences" },
                        { label: "My Matches",               icon: "💞", href: "/profiles" },
                        { label: "Messages",                 icon: "💬", href: "/chat" },
                        { label: "Settings",                 icon: "⚙️", href: "/settings" },
                        { label: "Help",                     icon: "❓", href: "/help" },
                      ].map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-xs text-gray-600 hover:bg-red-50 hover:text-[#c0174c] transition-colors"
                        >
                          <span style={{ fontSize: 13 }}>{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Guest buttons */
              <>
                <Link
                  href="/login"
                  className="px-5 py-2 text-sm font-bold rounded-lg text-white transition-colors"
                  style={{ background: "#b22234" }}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 text-sm font-bold rounded-lg text-white transition-colors hidden sm:block"
                  style={{ background: "#7a0e1e" }}
                >
                  Register Free?
                </Link>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border-2"
                  style={{ borderColor: "#b22234", color: "#b22234" }}
                >
                  GM
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Nav Bar (guest only) ── */}
      {!isLoggedIn && (
        <div style={{ background: "#b22234" }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center">
              {["Registration", "Login", "Search", "Membership", "Payment", "Contact"].map(
                (item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9a1d2b] transition-colors"
                  >
                    {item}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
