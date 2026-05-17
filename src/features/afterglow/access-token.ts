// Client-side token storage + expiry check. Signature is verified server-side
// at mint time; we trust the opaque token here and only read its expiry to
// decide whether to re-prompt. Any tampering will simply fail the next API call.
const STORAGE_KEY = "afterglow_access";

export type StoredToken = { token: string; exp: number };

const fromBase64Url = (s: string): string => {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  try {
    return atob(b64);
  } catch {
    return "";
  }
};

export const readToken = (): StoredToken | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredToken;
    if (!parsed?.token || typeof parsed.exp !== "number") return null;
    if (parsed.exp * 1000 <= Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    // Sanity check the payload shape (payload.signature)
    const [payload] = parsed.token.split(".");
    if (!payload) return null;
    const decoded = fromBase64Url(payload);
    if (!decoded.includes("afterglow")) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const writeToken = (t: StoredToken) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(t));
};

export const clearToken = () => {
  window.localStorage.removeItem(STORAGE_KEY);
};
