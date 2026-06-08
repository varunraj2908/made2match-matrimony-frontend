import { getReceivedInterests } from "@/services/matchesService";
import {
  getWhoViewedMe,
  getWhoShortlistedMe,
  getNewMatches,
} from "@/services/homeService";

// ── Unified notification shape the bell + page render ──────────────
export type NotificationType =
  | "interest"
  | "view"
  | "shortlist"
  | "match"
  | "message";

export interface AppNotification {
  id: string;
  type: NotificationType;
  name: string;
  photo?: string;
  message: string;
  time: string; // human-readable relative time
  timestamp: number; // epoch ms, for sorting (0 = undated)
  profileId?: number; // for navigation
  unread: boolean;
}

const fallbackPhoto = (name?: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "?")}&background=b22234&color=fff&size=120`;

const relTime = (iso?: string): { label: string; ts: number } => {
  if (!iso) return { label: "Recently", ts: 0 };
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return { label: "Recently", ts: 0 };
  const s = Math.floor((Date.now() - ts) / 1000);
  let label: string;
  if (s < 60) label = "Just now";
  else if (s < 3600) label = `${Math.floor(s / 60)} min ago`;
  else if (s < 86400) {
    const h = Math.floor(s / 3600);
    label = `${h} hour${h > 1 ? "s" : ""} ago`;
  } else {
    const d = Math.floor(s / 86400);
    if (d === 1) label = "Yesterday";
    else if (d < 7) label = `${d} days ago`;
    else label = new Date(iso).toLocaleDateString();
  }
  return { label, ts };
};

// "unread" = happened within the last 2 days (no server-side read flag yet).
const RECENT_MS = 2 * 24 * 60 * 60 * 1000;
const isRecent = (ts: number) => ts > 0 && Date.now() - ts < RECENT_MS;

/**
 * Build the notification feed from existing activity endpoints.
 * Each source is fetched independently — one failing source won't blank
 * out the others.
 */
export const fetchNotifications = async (): Promise<AppNotification[]> => {
  const [interests, views, shortlists, matches] = await Promise.allSettled([
    getReceivedInterests(0, 30),
    getWhoViewedMe(0, 20),
    getWhoShortlistedMe(0, 20),
    getNewMatches(0, 10),
  ]);

  const out: AppNotification[] = [];

  // ── Interests received ──
  if (interests.status === "fulfilled") {
    for (const it of interests.value.content ?? []) {
      const s = it.sender ?? {};
      const name = [s.firstName, s.lastName].filter(Boolean).join(" ") || "Someone";
      const when = relTime(it.updatedAt || it.sentAt);
      const message =
        it.status === "ACCEPTED"
          ? "accepted your interest"
          : it.status === "REJECTED"
            ? "declined your interest"
            : "sent you an interest";
      out.push({
        id: `interest-${it.id}`,
        type: "interest",
        name,
        photo: s.profilePhotoUrl || fallbackPhoto(name),
        message,
        time: when.label,
        timestamp: when.ts,
        profileId: s.id,
        unread: it.status === "PENDING" || isRecent(when.ts),
      });
    }
  }

  // ── Who viewed me ──
  if (views.status === "fulfilled") {
    for (const a of views.value.content ?? []) {
      const when = relTime(a.activityDate);
      out.push({
        id: `view-${a.profileId}-${when.ts}`,
        type: "view",
        name: a.fullName || "Someone",
        photo: a.profilePhotoUrl || fallbackPhoto(a.fullName),
        message: "viewed your profile",
        time: when.label,
        timestamp: when.ts,
        profileId: a.profileId,
        unread: isRecent(when.ts),
      });
    }
  }

  // ── Who shortlisted me ──
  if (shortlists.status === "fulfilled") {
    for (const a of shortlists.value.content ?? []) {
      const when = relTime(a.activityDate);
      out.push({
        id: `shortlist-${a.profileId}-${when.ts}`,
        type: "shortlist",
        name: a.fullName || "Someone",
        photo: a.profilePhotoUrl || fallbackPhoto(a.fullName),
        message: "shortlisted your profile",
        time: when.label,
        timestamp: when.ts,
        profileId: a.profileId,
        unread: isRecent(when.ts),
      });
    }
  }

  // ── New matches (no activity date — shown as recent) ──
  if (matches.status === "fulfilled") {
    for (const m of matches.value.content ?? []) {
      const name = m.fullName || [m.firstName, m.lastName].filter(Boolean).join(" ") || "Someone";
      out.push({
        id: `match-${m.profileId}`,
        type: "match",
        name,
        photo: m.profilePhotoUrl || fallbackPhoto(name),
        message: "is a new match for you!",
        time: "New match",
        timestamp: 0,
        profileId: m.profileId,
        unread: true,
      });
    }
  }

  // Newest first; undated (ts 0, e.g. matches) sink to the bottom.
  out.sort((a, b) => b.timestamp - a.timestamp);
  return out;
};
