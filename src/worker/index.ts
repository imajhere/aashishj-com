/**
 * Cloudflare Worker entry — wraps the static `dist/` site with auth on `/status*`.
 *
 * Runs in front of Workers Static Assets. For any path under `/status`, requires
 * HTTP Basic Auth (one shared username + password, stored as `STATUS_PASSWORD`
 * Cloudflare secret). All other paths fall through to static assets unchanged.
 *
 * Why Basic Auth: simplest browser-native flow, no OAuth dance, shareable with
 * Rishitha. Defense-in-depth via path obscurity is intentionally NOT used —
 * we accept that the URL is public knowledge and rely on the password.
 */

// Inline the minimal Cloudflare Workers types we need. Avoids adding
// `@cloudflare/workers-types` as a dep (would require a lockfile update).
interface AssetFetcher {
  fetch(request: Request): Promise<Response>;
}

interface Env {
  ASSETS: AssetFetcher;
  STATUS_PASSWORD?: string;
}

const STATUS_USERNAME = "aj";
const REALM = "aashishj.com/status";

function unauthorized(message = "Authentication required."): Response {
  return new Response(message, {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}"`,
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) diff |= aBytes[i] ^ bBytes[i];
  return diff === 0;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const isStatusPath =
      url.pathname === "/status" ||
      url.pathname === "/status/" ||
      url.pathname.startsWith("/status/");

    if (isStatusPath) {
      // Fail closed: if the secret isn't configured, deny everyone.
      if (!env.STATUS_PASSWORD) {
        return unauthorized(
          "STATUS_PASSWORD is not configured. Set the secret in Cloudflare and redeploy."
        );
      }

      const auth = request.headers.get("Authorization") || "";
      if (!auth.startsWith("Basic ")) {
        return unauthorized();
      }

      let decoded: string;
      try {
        decoded = atob(auth.slice("Basic ".length));
      } catch {
        return unauthorized();
      }

      const colonIdx = decoded.indexOf(":");
      if (colonIdx < 0) return unauthorized();
      const user = decoded.slice(0, colonIdx);
      const pass = decoded.slice(colonIdx + 1);

      const userOk = timingSafeEqual(user, STATUS_USERNAME);
      const passOk = timingSafeEqual(pass, env.STATUS_PASSWORD);
      if (!userOk || !passOk) {
        return unauthorized();
      }
      // fall through to static assets
    }

    return env.ASSETS.fetch(request);
  },
};
