"use client";

import CoastHeaderBar from "@/components/layout/CoastHeaderBar";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  acceptInterest,
  getReceivedInterests,
  getSentInterestsList,
  rejectInterest,
  withdrawInterest,
  type InterestDto,
  type InterestStatus,
} from "@/services/matchesService";

/* ─────────────────────────────────────────────
   DISPLAY HELPERS
───────────────────────────────────────────── */
const fallbackAvatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d4a89a&color=fff&size=208`;

const formatHeight = (cm?: number): string => {
  if (!cm) return "—";
  const totalIn = Math.round(cm / 2.54);
  return `${Math.floor(totalIn / 12)}'${totalIn % 12}"`;
};

const formatDate = (iso?: string): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" });
};

const profileCode = (id?: number): string =>
  id != null ? `E${String(id).padStart(7, "0")}` : "—";

interface CardData {
  profileNumericId: number;
  code: string;
  name: string;
  age?: number;
  height: string;
  caste: string;
  education: string;
  profession: string;
  location: string;
  photo: string;
  sentDate: string;
  sentByLabel: string;
}

function toCard(i: InterestDto, mode: "received" | "sent"): CardData {
  const p = mode === "received" ? i.sender : i.receiver;
  const fullName =
    [p?.firstName, p?.lastName].filter(Boolean).join(" ").trim() || "Member";
  return {
    profileNumericId: p?.id ?? 0,
    code: profileCode(p?.id),
    name: fullName,
    age: p?.age,
    height: formatHeight(p?.heightCm),
    caste: p?.caste || "—",
    education: p?.highestQualification || "—",
    profession: p?.occupation || "—",
    location: p?.city || "—",
    photo: p?.profilePhotoUrl || fallbackAvatar(fullName),
    sentDate: formatDate(i.sentAt),
    sentByLabel: mode === "received" ? "She sent you an interest" : "You sent an interest",
  };
}

/* ─────────────────────────────────────────────
   COUNTS & SECTION MAPPING
───────────────────────────────────────────── */
interface SectionCounts {
  all: number;
  pending: number;
  accepted: number;
  declined: number;
}

const blankCounts = (): SectionCounts => ({ all: 0, pending: 0, accepted: 0, declined: 0 });

function computeCounts(list: InterestDto[]): SectionCounts {
  const c = blankCounts();
  list.forEach((i) => {
    c.all++;
    if (i.status === "PENDING") c.pending++;
    else if (i.status === "ACCEPTED") c.accepted++;
    else if (i.status === "REJECTED" || i.status === "WITHDRAWN") c.declined++;
  });
  return c;
}

function statusForKey(key: string): InterestStatus[] {
  if (key === "pending") return ["PENDING"];
  if (key === "accepted") return ["ACCEPTED"];
  if (key === "declined") return ["REJECTED", "WITHDRAWN"];
  return []; // "all"
}

function filterByKey(list: InterestDto[], key: string): InterestDto[] {
  const statuses = statusForKey(key);
  if (statuses.length === 0) return list;
  return list.filter((i) => statuses.includes(i.status));
}

const ITEM_LABELS = [
  { key: "all",      label: "All" },
  { key: "pending",  label: "Pending" },
  { key: "accepted", label: "Accepted/Replied" },
  { key: "declined", label: "Declined" },
];

const sectionLabel = (activeSection: string, counts: { received: SectionCounts; sent: SectionCounts }): string => {
  const [m, k] = activeSection.split("-");
  const c = m === "received" ? counts.received : counts.sent;
  const n =
    k === "all" ? c.all :
    k === "pending" ? c.pending :
    k === "accepted" ? c.accepted :
    k === "declined" ? c.declined : 0;
  const lbl = ITEM_LABELS.find((i) => i.key === k)?.label ?? activeSection;
  return `${lbl} (${n})`;
};

const sectionHeading = (activeSection: string, counts: { received: SectionCounts; sent: SectionCounts }) => {
  const [m, k] = activeSection.split("-");
  const c = m === "received" ? counts.received : counts.sent;
  const n =
    k === "all" ? c.all :
    k === "pending" ? c.pending :
    k === "accepted" ? c.accepted :
    k === "declined" ? c.declined : 0;
  const title =
    m === "received"
      ? k === "all" ? `All interests (${n})`
        : k === "pending" ? `Pending interests (${n})`
        : k === "accepted" ? `Accepted/Replied (${n})`
        : `Declined (${n})`
      : k === "all" ? `All interests sent (${n})`
        : k === "pending" ? `Pending (${n})`
        : k === "accepted" ? `Accepted/Replied (${n})`
        : `Declined (${n})`;
  const subtitle =
    m === "received"
      ? k === "pending" ? "Interests from members awaiting your response"
        : k === "accepted" ? "Interests you have accepted or replied to"
        : k === "declined" ? "Interests you have declined"
        : "All interests received from members"
      : k === "pending" ? "Interests awaiting their response"
        : k === "accepted" ? "Interests that have been accepted"
        : k === "declined" ? "Interests that have been declined or withdrawn"
        : "All interests you have sent";
  return { title, subtitle };
};

/* ─────────────────────────────────────────────
   SIDEBAR — large screens
───────────────────────────────────────────── */
function Sidebar({
  activeSection,
  setActiveSection,
  counts,
}: {
  activeSection: string;
  setActiveSection: (s: string) => void;
  counts: { received: SectionCounts; sent: SectionCounts };
}) {
  const renderRow = (group: "received" | "sent", item: { key: string; label: string }) => {
    const key = `${group}-${item.key}`;
    const isActive = activeSection === key;
    const groupCounts = group === "received" ? counts.received : counts.sent;
    const n =
      item.key === "all" ? groupCounts.all :
      item.key === "pending" ? groupCounts.pending :
      item.key === "accepted" ? groupCounts.accepted :
      groupCounts.declined;
    return (
      <li key={key} className="my-1">
        <button
          onClick={() => setActiveSection(key)}
          className="w-full text-left flex items-center justify-between py-1 group"
        >
          <span
            className={`text-sm ${
              isActive ? "text-green-600 font-semibold" : "text-gray-700 hover:text-gray-900"
            }`}
          >
            {item.label} ({n})
          </span>
        </button>
      </li>
    );
  };

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

        <h2 className="text-lg font-semibold text-white bg-[#b22234] py-4 px-5">Interests</h2>

        <h2 className="text-sm font-semibold text-[#b22234] py-4 px-5">Interests Received</h2>
        <div className="border-b h-px w-full border-gray-200" />
        <ul className="space-y-1 px-5 py-2">
          {ITEM_LABELS.map((item) => renderRow("received", item))}
        </ul>

        <h2 className="text-sm font-semibold text-[#b22234] py-4 px-5 border-t border-gray-100">
          Interests Sent
        </h2>
        <div className="border-b h-px w-full border-gray-200" />
        <ul className="space-y-1 px-5 py-2 pb-5">
          {ITEM_LABELS.map((item) => renderRow("sent", item))}
        </ul>
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────
   MOBILE DROPDOWN
───────────────────────────────────────────── */
function MobileSectionDropdown({
  activeSection,
  setActiveSection,
  counts,
}: {
  activeSection: string;
  setActiveSection: (s: string) => void;
  counts: { received: SectionCounts; sent: SectionCounts };
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (key: string) => { setActiveSection(key); setOpen(false); };

  const renderItem = (group: "received" | "sent", item: { key: string; label: string }) => {
    const key = `${group}-${item.key}`;
    const isActive = activeSection === key;
    const groupCounts = group === "received" ? counts.received : counts.sent;
    const n =
      item.key === "all" ? groupCounts.all :
      item.key === "pending" ? groupCounts.pending :
      item.key === "accepted" ? groupCounts.accepted :
      groupCounts.declined;
    return (
      <button
        key={key}
        onClick={() => handleSelect(key)}
        className={`w-full text-left flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
          isActive ? "text-green-600 font-semibold bg-green-50" : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        <span>{item.label} ({n})</span>
      </button>
    );
  };

  return (
    <div className="lg:hidden mb-3 relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-white border border-[#b22234] rounded-md px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm"
      >
        <span>{sectionLabel(activeSection, counts)}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
          <p className="text-xs font-semibold text-[#b22234] px-4 py-2.5 border-b border-gray-100 bg-gray-50">
            Interests Received
          </p>
          {ITEM_LABELS.map((item) => renderItem("received", item))}

          <p className="text-xs font-semibold text-[#b22234] px-4 py-2.5 border-t border-b border-gray-100 bg-gray-50">
            Interests Sent
          </p>
          {ITEM_LABELS.map((item) => renderItem("sent", item))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROFILE CARD — single interest row
───────────────────────────────────────────── */
function ProfileCard({
  interest,
  mode,
  busy,
  onAccept,
  onReject,
  onCancel,
  onOpenProfile,
}: {
  interest: InterestDto;
  mode: "received" | "sent";
  busy: boolean;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  onCancel: (id: number) => void;
  onOpenProfile: (profileId: number) => void;
}) {
  const card = toCard(interest, mode);
  const status = interest.status;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden p-4">
      <div className="flex">

        {/* Photo */}
        <button
          type="button"
          onClick={() => card.profileNumericId && onOpenProfile(card.profileNumericId)}
          className="shrink-0 cursor-pointer"
        >
          <img
            src={card.photo}
            alt={card.name}
            className="w-24 h-24 sm:w-40 sm:h-40 lg:w-52 lg:h-52 object-cover rounded-lg border border-[#b22234]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackAvatar(card.name);
            }}
          />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0 px-3 sm:px-6 flex flex-col justify-between relative">

          <button className="absolute top-0 right-0 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5"  r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          <div>
            <button
              type="button"
              onClick={() => card.profileNumericId && onOpenProfile(card.profileNumericId)}
              className="text-left cursor-pointer"
            >
              <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-0.5 pr-6">
                {card.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4">{card.code}</p>
            </button>

            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs sm:text-sm text-gray-600">
              {[
                card.age != null ? `${card.age} yrs` : null,
                card.height,
                card.caste,
                card.education,
                card.profession,
                card.location,
              ]
                .filter((v) => v && v !== "—")
                .map((item, i, arr) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <span>{item}</span>
                    {i < arr.length - 1 && (
                      <span className="w-1 h-1 rounded-full bg-gray-400 inline-block" />
                    )}
                  </span>
                ))}
            </div>
          </div>

          <div className="mt-3 sm:mt-6">
            <p className="text-xs sm:text-sm text-gray-800 mb-0.5">
              <span className="font-semibold">{card.sentByLabel}</span>
              {card.sentDate && <span className="text-gray-500"> - {card.sentDate}</span>}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
              {mode === "received"
                ? status === "PENDING"
                  ? "Accept her interest to start a conversation"
                  : status === "ACCEPTED"
                    ? "Interest accepted — start chatting"
                    : "You declined this interest"
                : status === "PENDING"
                  ? "Waiting for their response"
                  : status === "ACCEPTED"
                    ? "Your interest was accepted"
                    : status === "WITHDRAWN"
                      ? "You withdrew this interest"
                      : "Your interest was declined"}
            </p>

            {mode === "received" ? (
              status === "PENDING" ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => onReject(interest.id)}
                    disabled={busy}
                    className="flex items-center gap-1.5 border rounded-full px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                  >
                    👎 Decline
                  </button>
                  <button
                    onClick={() => onAccept(interest.id)}
                    disabled={busy}
                    className="flex items-center gap-1.5 border rounded-full px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all border-[#b22234] text-[#b22234] hover:bg-orange-50 disabled:opacity-50 cursor-pointer"
                  >
                    👍 Accept Interest
                  </button>
                </div>
              ) : (
                <span
                  className={`inline-block text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full ${
                    status === "ACCEPTED"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {status === "ACCEPTED" ? "Accepted ✓" : "Declined"}
                </span>
              )
            ) : (
              status === "PENDING" ? (
                <button
                  onClick={() => onCancel(interest.id)}
                  disabled={busy}
                  className="flex items-center gap-1.5 border border-[#b22234] text-[#b22234] hover:bg-orange-50 rounded-full px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all disabled:opacity-50 cursor-pointer"
                >
                  ✖ Cancel Interest
                </button>
              ) : (
                <span
                  className={`inline-block text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full ${
                    status === "ACCEPTED"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {status === "ACCEPTED"
                    ? "Accepted ✓"
                    : status === "WITHDRAWN"
                      ? "Withdrawn"
                      : "Declined"}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGINATION
───────────────────────────────────────────── */
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }
  const base = "flex items-center justify-center text-sm transition-colors border rounded-lg bg-white";

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-8 flex-wrap">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`${base} gap-1 px-2.5 sm:px-3 py-2 border-gray-200 text-gray-600 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm`}
      >
        ‹ Prev
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`${base} w-8 h-8 sm:w-9 sm:h-9 text-xs sm:text-sm font-medium ${
              currentPage === p
                ? "bg-green-600 border-green-600 text-white"
                : "border-gray-200 text-gray-600 hover:border-gray-400"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`${base} gap-1 px-2.5 sm:px-3 py-2 border-gray-200 text-gray-600 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm`}
      >
        Next ›
      </button>
    </div>
  );
}

const PAGE_SIZE = 8;

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function InterestsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("received-pending");
  const [currentPage, setCurrentPage] = useState(1);

  const [received, setReceived] = useState<InterestDto[]>([]);
  const [sent, setSent] = useState<InterestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [busyIds, setBusyIds] = useState<Set<number>>(new Set());
  const [toastMsg, setToastMsg] = useState<string>("");

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [r, s] = await Promise.all([
        getReceivedInterests(0, 500),
        getSentInterestsList(0, 500),
      ]);
      setReceived(r.content ?? []);
      setSent(s.content ?? []);
    } catch (ex: any) {
      setError(
        ex?.response?.data?.message ||
          ex?.message ||
          "Could not load interests.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Reset to page 1 whenever the section changes
  useEffect(() => { setCurrentPage(1); }, [activeSection]);

  const mode: "received" | "sent" = activeSection.startsWith("received") ? "received" : "sent";
  const sectionKey = activeSection.split("-")[1] ?? "pending";

  const counts = {
    received: computeCounts(received),
    sent: computeCounts(sent),
  };

  const sourceList = mode === "received" ? received : sent;
  const filtered = filterByKey(sourceList, sectionKey)
    .sort((a, b) => (b.sentAt || "").localeCompare(a.sentAt || ""));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const heading = sectionHeading(activeSection, counts);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(""), 2500);
  };

  const withBusy = async (id: number, fn: () => Promise<unknown>) => {
    setBusyIds((s) => new Set(s).add(id));
    try {
      await fn();
      await loadAll();
    } catch (ex: any) {
      showToast(ex?.response?.data?.message || ex?.message || "Action failed");
    } finally {
      setBusyIds((s) => { const n = new Set(s); n.delete(id); return n; });
    }
  };

  const handleAccept = (id: number) =>
    withBusy(id, async () => { await acceptInterest(id); showToast("Interest accepted"); });

  const handleReject = (id: number) =>
    withBusy(id, async () => { await rejectInterest(id); showToast("Interest declined"); });

  const handleCancel = (id: number) =>
    withBusy(id, async () => { await withdrawInterest(id); showToast("Interest withdrawn"); });

  const handleOpenProfile = (profileId: number) => router.push(`/profiles/${profileId}`);

  return (
    <div className="min-h-screen bg-gray-50">
      <CoastHeaderBar />

      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#b22234] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
          {toastMsg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6 items-start">
          <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} counts={counts} />

          <div className="flex-1 min-w-0">
            <MobileSectionDropdown
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              counts={counts}
            />

            <div className="flex items-start justify-between mb-5">
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-800">{heading.title}</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{heading.subtitle}</p>
              </div>
              <button className="flex items-center gap-2 border border-gray-300 rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:border-gray-400 bg-white transition-colors shrink-0 ml-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 4h18M6 12h12M10 20h4" />
                </svg>
                Filter
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 sm:w-40 sm:h-40 bg-gray-100 rounded-lg" />
                      <div className="flex-1 space-y-2 pt-2">
                        <div className="h-4 w-1/3 bg-gray-100 rounded" />
                        <div className="h-3 w-1/4 bg-gray-100 rounded" />
                        <div className="h-3 w-3/4 bg-gray-100 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : visible.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
                <p className="text-4xl mb-2">💌</p>
                <p className="text-sm font-semibold text-gray-700">No interests to show here</p>
                <p className="text-xs text-gray-400 mt-1">
                  Try a different category from the sidebar.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {visible.map((interest) => (
                  <ProfileCard
                    key={interest.id}
                    interest={interest}
                    mode={mode}
                    busy={busyIds.has(interest.id)}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onCancel={handleCancel}
                    onOpenProfile={handleOpenProfile}
                  />
                ))}
              </div>
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      </div>
    </div>
  );
}
