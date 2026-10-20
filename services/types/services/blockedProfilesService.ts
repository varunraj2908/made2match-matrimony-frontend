import axiosInstance from '@/api/axiosInstance';
import type { ApiEnvelope, PageEnvelope } from '@/services/homeService';

export interface BlockedProfile {
  blockedEntryId?: number;
  id: number;
  profileId: number;
  userId?: number;
  profileCode?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  age?: number;
  heightDisplay?: string;
  city?: string;
  state?: string;
  country?: string;
  profilePhotoUrl?: string;
  religion?: string;
  caste?: string;
  maritalStatus?: string;
  motherTongue?: string;
  highestQualification?: string;
  occupation?: string;
  isPremium?: boolean;
  blockedAt: string;
}

const EMPTY_PAGE: PageEnvelope<BlockedProfile> = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  number: 0,
  size: 10,
  first: true,
  last: true,
  empty: true,
};

const getResponseStatus = (error: unknown) =>
  (error as { response?: { status?: number } })?.response?.status;

const readStoredProfiles = (): BlockedProfile[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem('blockedProfilesData');
    if (!stored) return [];
    const blocked: unknown = JSON.parse(stored);
    return Array.isArray(blocked) ? (blocked as BlockedProfile[]) : [];
  } catch {
    return [];
  }
};

const writeStoredProfiles = (profiles: BlockedProfile[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('blockedProfilesData', JSON.stringify(profiles));
};

const toLocalPage = (
  profiles: BlockedProfile[],
  page: number,
  size: number,
): PageEnvelope<BlockedProfile> => {
  const start = page * size;
  const content = profiles.slice(start, start + size);
  const totalPages = profiles.length === 0 ? 0 : Math.ceil(profiles.length / size);

  return {
    content,
    totalElements: profiles.length,
    totalPages,
    number: page,
    size,
    first: page <= 0,
    last: totalPages === 0 || page >= totalPages - 1,
    empty: content.length === 0,
  };
};

export async function getBlockedProfilesPage(
  page = 0,
  size = 10,
): Promise<PageEnvelope<BlockedProfile>> {
  try {
    const response = await axiosInstance.get<ApiEnvelope<PageEnvelope<BlockedProfile>>>(
      '/blocked-profiles',
      { params: { page, size } },
    );

    return response.data.data ?? EMPTY_PAGE;
  } catch (error) {
    const status = getResponseStatus(error);

    if (status === 400 || status === 404 || status === 500 || status === 501 || !status) {
      return toLocalPage(readStoredProfiles(), page, size);
    }

    throw error;
  }
}

export async function getBlockedProfiles(): Promise<BlockedProfile[]> {
  const page = await getBlockedProfilesPage(0, 100);
  return page.content ?? [];
}

export async function blockProfile(
  profileId: number,
  profileData?: Partial<BlockedProfile>,
): Promise<void> {
  try {
    await axiosInstance.post('/blocked-profiles', { profileId });
  } catch (error) {
    const status = getResponseStatus(error);

    if (status === 400 || status === 404 || status === 500 || status === 501 || !status) {
      const blocked = readStoredProfiles();
      const exists = blocked.some((p) => p.profileId === profileId);

      if (!exists) {
        blocked.push({
          id: profileId,
          profileId,
          firstName: profileData?.firstName,
          lastName: profileData?.lastName,
          fullName:
            profileData?.fullName ||
            [profileData?.firstName, profileData?.lastName].filter(Boolean).join(' ') ||
            'Blocked User',
          age: profileData?.age,
          city: profileData?.city,
          state: profileData?.state,
          profilePhotoUrl: profileData?.profilePhotoUrl,
          occupation: profileData?.occupation,
          heightDisplay: profileData?.heightDisplay,
          religion: profileData?.religion,
          caste: profileData?.caste,
          highestQualification: profileData?.highestQualification,
          blockedAt: new Date().toISOString(),
        });
        writeStoredProfiles(blocked);
      }
      return;
    }

    throw error;
  }
}

export async function unblockProfile(profileId: number): Promise<void> {
  try {
    await axiosInstance.delete(`/blocked-profiles/${profileId}`);
  } catch (error) {
    const status = getResponseStatus(error);

    if (status === 400 || status === 404 || status === 500 || status === 501 || !status) {
      writeStoredProfiles(readStoredProfiles().filter((p) => p.profileId !== profileId));
      return;
    }

    throw error;
  }
}
