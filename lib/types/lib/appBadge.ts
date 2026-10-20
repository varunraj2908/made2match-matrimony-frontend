// Helpers for the PWA app-icon badge (Badging API).
// Shows the unread count on the installed app icon (taskbar / home screen).
// Gracefully no-ops on browsers that don't support it (e.g. Firefox, iOS Safari).

type BadgeNavigator = Navigator & {
  setAppBadge?: (count?: number) => Promise<void>;
  clearAppBadge?: () => Promise<void>;
};

export function setAppBadge(count: number): void {
  if (typeof navigator === "undefined") return;
  const nav = navigator as BadgeNavigator;
  try {
    if (count > 0 && typeof nav.setAppBadge === "function") {
      nav.setAppBadge(count).catch(() => {/* ignore */});
    } else if (typeof nav.clearAppBadge === "function") {
      nav.clearAppBadge().catch(() => {/* ignore */});
    }
  } catch {
    /* Badging API unsupported — ignore */
  }
}

export function clearAppBadge(): void {
  setAppBadge(0);
}
