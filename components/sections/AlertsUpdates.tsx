"use client";

import { useEffect, useState } from "react";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences,
  type NotificationPreferenceKey,
} from "@/services/notificationPreferenceService";

/* ─── Toggle switch ─────────────────────────────────────────── */
function Toggle({
  on,
  disabled,
  onChange,
}: {
  on: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 disabled:opacity-50 ${
        on ? "" : "bg-gray-300"
      }`}
      style={on ? { background: "linear-gradient(135deg,#c0174c,#8b0f38)" } : undefined}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
          on ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

/* ─── One preference row ────────────────────────────────────── */
function Row({
  title,
  desc,
  on,
  disabled,
  onToggle,
}: {
  title: string;
  desc: string;
  on: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-snug">{desc}</p>
      </div>
      <Toggle on={on} disabled={disabled} onChange={onToggle} />
    </div>
  );
}

/* ─── Group of rows with a coloured heading ─────────────────── */
function Group({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold" style={{ color: "#c0174c" }}>
        {title}
      </h3>
      <p className="text-xs text-gray-400 mt-1 mb-2 leading-snug">{hint}</p>
      <div className="rounded-2xl border border-gray-100 bg-white px-4 shadow-sm">
        {children}
      </div>
    </div>
  );
}

/* ─── Channel section header (E-Mail / SMS) ─────────────────── */
function ChannelHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
        style={{ background: "linear-gradient(135deg,#c0174c,#8b0f38)" }}
      >
        {icon}
      </span>
      <div>
        <h2 className="text-lg md:text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

const MailIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 5L2 7" />
  </svg>
);
const SmsIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function AlertsUpdates() {
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingKey, setSavingKey] = useState<NotificationPreferenceKey | null>(null);

  useEffect(() => {
    getNotificationPreferences()
      .then(setPrefs)
      .catch((e) =>
        setError(
          (e as { response?: { data?: { message?: string } } })?.response?.data
            ?.message || "Could not load your alert preferences.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  // Optimistic toggle: flip locally, persist, roll back on failure.
  const toggle = async (key: NotificationPreferenceKey) => {
    if (!prefs) return;
    const next = !prefs[key];
    setPrefs({ ...prefs, [key]: next });
    setSavingKey(key);
    try {
      await updateNotificationPreferences({ [key]: next });
    } catch {
      setPrefs((p) => (p ? { ...p, [key]: !next } : p));
    } finally {
      setSavingKey(null);
    }
  };

  const Header = (
    <>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Alerts &amp; Updates</h2>
      <div className="border-t border-dashed border-gray-300 my-4" />
    </>
  );

  if (loading) {
    return (
      <div>
        {Header}
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !prefs) {
    return (
      <div>
        {Header}
        <p className="text-sm text-red-600 font-medium">{error || "No data."}</p>
      </div>
    );
  }

  const busy = (k: NotificationPreferenceKey) => savingKey === k;

  return (
    <div className="max-w-2xl">
      {Header}
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        Choose how you'd like to hear from us. Toggle any alert on or off — changes save automatically.
      </p>

      {/* ── E-MAIL ── */}
      <section className="mb-10">
        <ChannelHeader icon={MailIcon} title="E-Mail" subtitle="Updates you receive on your e-mail" />

        <Group title="Member Activity" hint="If you turn these off, you won't get any mails about member activity on your profile.">
          <Row title="Phone Number Views" desc="When members view your number" on={prefs.emailPhoneNumberViews} disabled={busy("emailPhoneNumberViews")} onToggle={() => toggle("emailPhoneNumberViews")} />
          <Row title="Requests" desc="When members request for your information" on={prefs.emailRequests} disabled={busy("emailRequests")} onToggle={() => toggle("emailRequests")} />
          <Row title="Shortlists" desc="When members shortlist you" on={prefs.emailShortlists} disabled={busy("emailShortlists")} onToggle={() => toggle("emailShortlists")} />
        </Group>

        <Group title="Member Response" hint="If you turn these off, you will not know when members respond to you.">
          <Row title="Accepts" desc="When members accept your interests or requests" on={prefs.emailAccepts} disabled={busy("emailAccepts")} onToggle={() => toggle("emailAccepts")} />
          <Row title="Declines" desc="When members decline your interests or requests" on={prefs.emailDeclines} disabled={busy("emailDeclines")} onToggle={() => toggle("emailDeclines")} />
        </Group>

        <Group title="Matches" hint="If you turn these off, you might miss out on our recommendations based on your preferences.">
          <Row title="Horoscope Matches" desc="Weekly" on={prefs.emailHoroscopeMatches} disabled={busy("emailHoroscopeMatches")} onToggle={() => toggle("emailHoroscopeMatches")} />
          <Row title="Premium Matches" desc="Everyday" on={prefs.emailPremiumMatches} disabled={busy("emailPremiumMatches")} onToggle={() => toggle("emailPremiumMatches")} />
          <Row title="Matches with new photo" desc="Weekly" on={prefs.emailMatchesWithNewPhoto} disabled={busy("emailMatchesWithNewPhoto")} onToggle={() => toggle("emailMatchesWithNewPhoto")} />
          <Row title="New Matches" desc="Everyday" on={prefs.emailNewMatches} disabled={busy("emailNewMatches")} onToggle={() => toggle("emailNewMatches")} />
        </Group>
      </section>

      {/* ── SMS ── */}
      <section>
        <ChannelHeader icon={SmsIcon} title="SMS" subtitle="Updates you get via SMS" />

        <Group title="Member Activity" hint="If you turn these off, you won't get any SMS about member activity on your profile.">
          <Row title="Phone Number Views" desc="When members view your number" on={prefs.smsPhoneNumberViews} disabled={busy("smsPhoneNumberViews")} onToggle={() => toggle("smsPhoneNumberViews")} />
          <Row title="Express Interest" desc="When members send an interest" on={prefs.smsExpressInterest} disabled={busy("smsExpressInterest")} onToggle={() => toggle("smsExpressInterest")} />
          <Row title="Personalized Messages" desc="When premium members send messages" on={prefs.smsPersonalizedMessages} disabled={busy("smsPersonalizedMessages")} onToggle={() => toggle("smsPersonalizedMessages")} />
        </Group>
      </section>
    </div>
  );
}
