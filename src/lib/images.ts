const BLOCKED_PAGE_HOSTS = new Set([
  "facebook.com",
  "www.facebook.com",
  "m.facebook.com",
  "web.facebook.com",
  "instagram.com",
  "www.instagram.com",
]);

export function isValidImageUrl(raw: string): boolean {
  const url = raw.trim();
  if (!url) return false;

  if (url.startsWith("/") && !url.startsWith("//")) return true;

  if (url.startsWith("data:image/")) return true;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;

  const host = parsed.hostname.toLowerCase();
  if (BLOCKED_PAGE_HOSTS.has(host)) return false;

  return true;
}

export const imageUrlHint =
  "Paste a direct image link (https://…jpg/.png). Facebook/Instagram post or page links are not images — use Upload instead.";
