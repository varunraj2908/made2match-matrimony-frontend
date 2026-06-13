"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchNotifications,
  type AppNotification,
} from "@/services/notificationService";

const NOTIF_ICONS: Record<string, { icon: string; bg: string }> = {
  interest:  { icon: "💞", bg: "#ffeaf2" },
  view:      { icon: "👁️", bg: "#e4f8fc" },
  shortlist: { icon: "⭐", bg: "#fff7df" },
  message:   { icon: "💬", bg: "#fff8e1" },
  match:     { icon: "❤️", bg: "#ffeaea" },
};

export default function NotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "unread">("all");

  useEffect(() => {
    let cancelled = false;
    fetchNotifications()
      .then((list) => { if (!cancelled) setItems(list); })
      .catch(() => undefined)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const unreadCount = items.filter((n) => n.unread).length;
  const shown = tab === "unread" ? items.filter((n) => n.unread) : items;

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  const open = (n: AppNotification) => {
    setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x)));
    if (n.profileId) router.push(`/profiles/${n.profileId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-6 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#b22234] transition-colors mb-3"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-gray-800">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-[#b22234] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button onClick={markAllRead} className="text-xs font-semibold text-[#b22234] hover:underline">
              Mark all read
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {(["all", "unread"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-xs font-bold capitalize transition-colors ${
                  tab === t ? "text-[#b22234] border-b-2 border-[#b22234]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t === "all" ? `All (${items.length})` : `Unread (${unreadCount})`}
              </button>
            ))}
          </div>

          {/* List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b22234" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
              <p className="text-sm mt-3">Loading notifications…</p>
            </div>
          ) : shown.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-300">
              <span style={{ fontSize: 40 }}>🔔</span>
              <p className="text-sm mt-3">
                {tab === "unread" ? "No unread notifications" : "No notifications yet"}
              </p>
            </div>
          ) : (
            shown.map((n) => {
              const meta = NOTIF_ICONS[n.type] ?? NOTIF_ICONS.match;
              return (
                <div
                  key={n.id}
                  onClick={() => open(n)}
                  className={`flex items-start gap-3 px-4 sm:px-5 py-3.5 cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${
                    n.unread ? "bg-[#fff9f9] hover:bg-[#fdf2f3]" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={n.photo}
                      alt={n.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border-2 border-white"
                      style={{ background: meta.bg }}
                    >
                      {meta.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      <span className="font-bold">{n.name}</span>{" "}
                      <span className="text-gray-500">{n.message}</span>
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                  {n.unread && (
                    <span className="shrink-0 w-2 h-2 rounded-full mt-2" style={{ background: "#b22234" }} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
