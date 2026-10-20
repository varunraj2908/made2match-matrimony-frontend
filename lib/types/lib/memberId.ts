const MEMBER_ID_PREFIX = "MTM";
const MEMBER_ID_WIDTH = 5;

const digitsFrom = (value?: number | string | null): string => {
  if (value == null) return "";
  return String(value).match(/\d+/g)?.join("") ?? "";
};

export const formatMemberId = (id?: number | string | null): string =>
  digitsFrom(id)
    ? `${MEMBER_ID_PREFIX}${digitsFrom(id).padStart(MEMBER_ID_WIDTH, "0")}`
    : "—";

export const formatProfileCode = (
  profileCode?: string | null,
  fallbackId?: number | string | null,
): string => {
  if (profileCode?.trim().toUpperCase().startsWith(MEMBER_ID_PREFIX)) {
    return profileCode.trim().toUpperCase();
  }
  return formatMemberId(fallbackId ?? profileCode);
};
