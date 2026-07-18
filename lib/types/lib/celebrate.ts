// Fires the global "It's a Match!" celebration from anywhere in the app.
// Listened to by <MatchCelebration /> mounted in the (main) layout.

export const MATCH_CELEBRATE_EVENT = "match:celebrate";

export interface MatchCelebrationDetail {
  name: string;
  photo?: string;
  profileId?: number;
}

export function celebrateMatch(detail: MatchCelebrationDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(MATCH_CELEBRATE_EVENT, { detail }));
}

// ── Welcome celebration (one-time, after registration / onboarding) ──
export const WELCOME_CELEBRATION_KEY = "m2m_welcome_celebration";

/** Arm the welcome celebration — call when onboarding completes. */
export function markWelcomeCelebration(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WELCOME_CELEBRATION_KEY, "1");
  } catch {
    /* ignore */
  }
}

/** Returns true once (then clears the flag) — used by the home celebration. */
export function consumeWelcomeCelebration(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (localStorage.getItem(WELCOME_CELEBRATION_KEY) === "1") {
      localStorage.removeItem(WELCOME_CELEBRATION_KEY);
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}
