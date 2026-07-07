import axiosInstance from "@/api/axiosInstance";
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
  | "message"
  | "report";

export interface AppNotification {
  id: string;
  type: NotificationType;
  name: string;
  photo?: string;
  message: string;
  time: string;       // human-readable relative time
  timestamp: number;  // epoch ms, for sorting (0 = undated)
  profileId?: number; // for navigation
  unread: boolean;
}

// ── localStorage key for persisting read notification IDs ──────────
const LS_KEY = "m2m_read_notif_ids";
const REPORT_LS_KEY = "m2m_report_notifs";

interface StoredReportNotification {
  id: string;
  reportedProfileId: number;
  reportedProfileName: string;
  createdAt: string;
}

const getReadIds = (): Set<string> => {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
};

const saveReadIds = (ids: Set<string>) => {
  if (typeof window === "undefined") return;
  try {
    // Keep only the most recent 500 IDs to avoid bloat
    const arr = Array.from(ids).slice(-500);
    localStorage.setItem(LS_KEY, JSON.stringify(arr));
  } catch { /* storage full — ignore */ }
};

/**
 * Mark all supplied notification IDs as read in localStorage.
 * Returns the updated set.
 */
export const persistReadIds = (ids: string[]): void => {
  const current = getReadIds();
  ids.forEach((id) => current.add(id));
  saveReadIds(current);
};

const getStoredReportNotifications = (): StoredReportNotification[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REPORT_LS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as StoredReportNotification[]) : [];
  } catch {
    return [];
  }
};

const saveStoredReportNotifications = (items: StoredReportNotification[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REPORT_LS_KEY, JSON.stringify(items.slice(-50)));
  } catch { /* storage full - ignore */ }
};

export const addReportNotification = ({
  reportId,
  reportedProfileId,
  reportedProfileName,
  createdAt,
}: {
  reportId: number;
  reportedProfileId: number;
  reportedProfileName: string;
  createdAt: string;
}): void => {
  if (typeof window === "undefined") return;
  const id = `report-${reportId}`;
  const next = [
    ...getStoredReportNotifications().filter((item) => item.id !== id),
    { id, reportedProfileId, reportedProfileName, createdAt },
  ];
  saveStoredReportNotifications(next);
  window.dispatchEvent(new CustomEvent("notifications:refresh"));
};

/**
 * Call backend to mark all received interests as read.
 * Best-effort — failure is silent.
 */
export const markInterestsReadOnServer = async (): Promise<void> => {
  try {
    await axiosInstance.patch("/interests/mark-read");
  } catch { /* best effort */ }
};

// ── Helpers ────────────────────────────────────────────────────────
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

/**
 * Build the notification feed from existing activity endpoints.
 * Unread state:
 *   - interests: use backend readAt field (null = unread)
 *   - views/shortlists/matches: use localStorage read IDs
 */
export const fetchNotifications = async (): Promise<AppNotification[]> => {
  const readIds = getReadIds();

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
      const notifId = `interest-${it.id}`;
      // unread = readAt is null/missing on the server AND not in localStorage
      const unread = !it.readAt && !readIds.has(notifId);
      out.push({
        id: notifId,
        type: "interest",
        name,
        photo: s.profilePhotoUrl || fallbackPhoto(name),
        message,
        time: when.label,
        timestamp: when.ts,
        profileId: s.id,
        unread,
      });
    }
  }

  // ── Who viewed me ──
  if (views.status === "fulfilled") {
    for (const a of views.value.content ?? []) {
      const when = relTime(a.activityDate);
      const notifId = `view-${a.profileId}-${when.ts}`;
      out.push({
        id: notifId,
        type: "view",
        name: a.fullName || "Someone",
        photo: a.profilePhotoUrl || fallbackPhoto(a.fullName),
        message: "viewed your profile",
        time: when.label,
        timestamp: when.ts,
        profileId: a.profileId,
        unread: !readIds.has(notifId),
      });
    }
  }

  // ── Who shortlisted me ──
  if (shortlists.status === "fulfilled") {
    for (const a of shortlists.value.content ?? []) {
      const when = relTime(a.activityDate);
      const notifId = `shortlist-${a.profileId}-${when.ts}`;
      out.push({
        id: notifId,
        type: "shortlist",
        name: a.fullName || "Someone",
        photo: a.profilePhotoUrl || fallbackPhoto(a.fullName),
        message: "shortlisted your profile",
        time: when.label,
        timestamp: when.ts,
        profileId: a.profileId,
        unread: !readIds.has(notifId),
      });
    }
  }

  // ── New matches ──
  if (matches.status === "fulfilled") {
    for (const m of matches.value.content ?? []) {
      const name = m.fullName || [m.firstName, m.lastName].filter(Boolean).join(" ") || "Someone";
      const notifId = `match-${m.profileId}`;
      out.push({
        id: notifId,
        type: "match",
        name,
        photo: m.profilePhotoUrl || fallbackPhoto(name),
        message: "is a new match for you!",
        time: "New match",
        timestamp: 0,
        profileId: m.profileId,
        unread: !readIds.has(notifId),
      });
    }
  }

  for (const report of getStoredReportNotifications()) {
    const when = relTime(report.createdAt);
    out.push({
      id: report.id,
      type: "report",
      name: "Made2Match",
      photo: fallbackPhoto("Made2Match"),
      message: `received your report for ${report.reportedProfileName}`,
      time: when.label,
      timestamp: when.ts,
      profileId: report.reportedProfileId,
      unread: !readIds.has(report.id),
    });
  }

  // Newest first; undated items (matches) sink to the bottom.
  out.sort((a, b) => b.timestamp - a.timestamp);
  return out;
};
