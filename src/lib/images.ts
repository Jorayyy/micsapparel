const ALLOWED_HOSTS = new Set([
  "picsum.photos",
  "graph.facebook.com",
  "ui-avatars.com",
  "images.unsplash.com",
]);

const ALLOWED_SUFFIXES = [".fbcdn.net"];

export function isValidImageUrl(raw: string): boolean {
  const url = raw.trim();
  if (!url) return false;

  if (url.startsWith("/") && !url.startsWith("//")) return true;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;

  const host = parsed.hostname.toLowerCase();
  if (ALLOWED_HOSTS.has(host)) return true;
  return ALLOWED_SUFFIXES.some((suffix) => host.endsWith(suffix));
}

export const imageUrlHint =
  "Paste a direct image link (https://…jpg/.png from an allowed host) or use Upload. Facebook post/page links are not images.";
