"use client";

import { useCallback, useEffect, useState } from "react";
import { Ban } from "lucide-react";
import {
  getBlockedProfilesPage,
  unblockProfile,
  type BlockedProfile,
} from "@/services/blockedProfilesService";
import type { PageEnvelope } from "@/services/homeService";
import { formatProfileCode } from "@/lib/memberId";

const PAGE_SIZE = 10;

const emptyPage: PageEnvelope<BlockedProfile> = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  number: 0,
  size: PAGE_SIZE,
  first: true,
  last: true,
  empty: true,
};

const formatValue = (value?: string | number | null) =>
  value === undefined || value === null || value === "" ? "Not specified" : String(value);

const getInitials = (profile: BlockedProfile) => {
  const name =
    profile.fullName ||
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    "Blocked Profile";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const getFullName = (profile: BlockedProfile) =>
  profile.fullName ||
  [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
  "Blocked Profile";

const getLocation = (profile: BlockedProfile) =>
  [profile.country || "India", profile.state, profile.city].filter(Boolean).join(" / ");

const getErrorMessage = (error: unknown) =>
  (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data
    ?.message ||
  (error as { message?: string })?.message ||
  "Could not load blocked profiles.";

function BlockedProfileCard({
  profile,
  onUnblock,
  busy,
}: {
  profile: BlockedProfile;
  onUnblock: (profile: BlockedProfile) => void;
  busy: boolean;
}) {
  const fullName = getFullName(profile);
  const initials = getInitials(profile);
  const location = getLocation(profile);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[180px_minmax(0,1fr)_180px] gap-3 p-3 sm:py-3 sm:px-4">
        <div className="flex flex-col items-center">
          <div
            className="relative w-full max-w-[168px] aspect-[168/184] rounded-md overflow-hidden border border-gray-200 shadow-sm bg-[#c0174c]"
            aria-label={`${fullName} profile photo`}
            role="img"
            style={
              profile.profilePhotoUrl
                ? {
                    backgroundImage: `url("${profile.profilePhotoUrl}")`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }
                : undefined
            }
          >
            {!profile.profilePhotoUrl && (
              <div className="w-full h-full flex items-center justify-center text-white text-4xl font-light tracking-wide">
                {initials}
              </div>
            )}
            <div className="absolute bottom-1.5 right-1.5 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              1/1
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-gray-300 text-lg leading-none">&#9825;</span>
            <h3
              className="text-lg sm:text-xl font-bold text-gray-900"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {fullName}
            </h3>
          </div>

          <div className="space-y-0.5 text-xs sm:text-[13px] text-gray-800">
            <p>
              <span className="font-semibold text-gray-500 w-28 inline-block">Age:</span>
              {profile.age ? `${profile.age} Yrs` : "Not specified"}
              <span className="mx-1 text-gray-300">|</span>
              Height: {formatValue(profile.heightDisplay)}
            </p>
            <p>
              <span className="font-semibold text-gray-500 w-28 inline-block">
                Religion:
              </span>
              {formatValue(profile.religion)}
            </p>
            <p>
              <span className="font-semibold text-gray-500 w-28 inline-block">Caste:</span>
              {formatValue(profile.caste)}
            </p>
            <p>
              <span className="font-semibold text-gray-500 w-28 inline-block">
                Location:
              </span>
              {location || "Not specified"}
            </p>
            <p>
              <span className="font-semibold text-gray-500 w-28 inline-block">
                Education:
              </span>
              {formatValue(profile.highestQualification)}
            </p>
            <p>
              <span className="font-semibold text-gray-500 w-28 inline-block">
                Profession:
              </span>
              {formatValue(profile.occupation)}
            </p>
            <p>
              <span className="font-semibold text-gray-500 w-28 inline-block">
                Profile ID:
              </span>
              <span className="font-mono font-bold text-[#c0174c]">
                {formatValue(formatProfileCode(profile.profileCode, profile.profileId))}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] text-gray-700 leading-relaxed">
            This profile is currently blocked and cannot see your profile or contact you.
          </p>

          <button
            type="button"
            onClick={() => onUnblock(profile)}
            disabled={busy}
            className="cursor-pointer w-full inline-flex items-center justify-center gap-2 border-2 border-[#c0174c] text-[#c0174c] hover:bg-[#c0174c] hover:text-white text-[11px] font-bold px-3 py-1.5 rounded transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Ban size={14} />
            {busy ? "UNBLOCKING..." : "UNBLOCK"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BlockedProfiles() {
  const [page, setPage] = useState<PageEnvelope<BlockedProfile>>(emptyPage);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unblockingId, setUnblockingId] = useState<number | null>(null);
  const [profileToUnblock, setProfileToUnblock] = useState<BlockedProfile | null>(null);

  const loadProfiles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getBlockedProfilesPage(pageIndex, PAGE_SIZE);
      setPage(data);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [pageIndex]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const requestUnblock = (profile: BlockedProfile) => {
    setProfileToUnblock(profile);
  };

  const handleUnblock = async () => {
    if (!profileToUnblock) return;
    const profile = profileToUnblock;
    setUnblockingId(profile.profileId);
    try {
      await unblockProfile(profile.profileId);
      setPage((current) => ({
        ...current,
        content: current.content.filter((item) => item.profileId !== profile.profileId),
        totalElements: Math.max(0, current.totalElements - 1),
        empty: current.content.length <= 1,
      }));
      window.dispatchEvent(
        new CustomEvent("profile-unblocked", {
          detail: { profileId: profile.profileId },
        }),
      );
      setProfileToUnblock(null);
    } catch (unblockError) {
      alert(getErrorMessage(unblockError));
    } finally {
      setUnblockingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Blocked Profiles
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {page.totalElements > 0 ? `${page.totalElements} blocked profile(s)` : ""}
          </p>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-300 my-4" />

      <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
        Profiles you have blocked won&apos;t be able to see your profile or contact you.
      </p>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="h-12 w-12 rounded-full border-2 border-[#f5c5d0] border-t-[#c0174c] animate-spin" />
          <p className="text-sm text-gray-500 mt-4">Loading blocked profiles...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 text-red-600">
            !
          </div>
          <p className="text-sm font-semibold text-red-600">{error}</p>
          <button
            type="button"
            onClick={loadProfiles}
            className="mt-4 text-sm font-bold text-[#c0174c] hover:text-[#9a123b]"
          >
            Try again
          </button>
        </div>
      ) : page.content.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-[#fff0f4] flex items-center justify-center mb-5">
            <Ban size={38} className="text-[#c0174c]" />
          </div>
          <p className="text-gray-700 text-base font-semibold">No blocked profiles</p>
          <p className="text-gray-400 text-sm mt-2">
            You haven&apos;t blocked anyone yet
          </p>
        </div>
      ) : (
        <>
          <div className="grid max-h-[500px] grid-cols-1 gap-4 overflow-y-auto pr-2">
            {page.content.map((profile) => (
              <BlockedProfileCard
                key={profile.blockedEntryId ?? profile.profileId}
                profile={profile}
                onUnblock={requestUnblock}
                busy={unblockingId === profile.profileId}
              />
            ))}
          </div>

          {page.totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                type="button"
                disabled={page.first}
                onClick={() => setPageIndex((current) => Math.max(0, current - 1))}
                className="px-4 py-2 rounded border border-gray-200 text-xs font-bold text-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-xs text-gray-500">
                Page {page.number + 1} of {page.totalPages}
              </span>
              <button
                type="button"
                disabled={page.last}
                onClick={() => setPageIndex((current) => current + 1)}
                className="px-4 py-2 rounded border border-gray-200 text-xs font-bold text-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {profileToUnblock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="unblock-confirm-title"
            className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0f4] text-[#c0174c]">
              <Ban size={24} />
            </div>
            <h3
              id="unblock-confirm-title"
              className="text-center text-lg font-bold text-gray-900"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Unblock {getFullName(profileToUnblock)}?
            </h3>
            <p className="mt-2 text-center text-sm leading-6 text-gray-600">
              This profile will be able to see your profile and contact you again.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProfileToUnblock(null)}
                disabled={unblockingId === profileToUnblock.profileId}
                className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUnblock}
                disabled={unblockingId === profileToUnblock.profileId}
                className="cursor-pointer rounded-lg bg-[#c0174c] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#9f123f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {unblockingId === profileToUnblock.profileId ? "Unblocking..." : "Unblock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
