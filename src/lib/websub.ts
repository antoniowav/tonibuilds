import { createHmac, timingSafeEqual } from "node:crypto";

/** The hub YouTube publishes channel feeds to (WebSub, formerly PubSubHubbub). */
export const hub = "https://pubsubhubbub.appspot.com/subscribe";

/**
 * Checks a notification's X-Hub-Signature ("sha1=<hex>", or another SHA) against the
 * HMAC of the raw body with our subscription secret, so only the hub can trigger us.
 */
export function validSignature(body: Buffer, header: string | null, secret: string): boolean {
  const m = header?.match(/^(sha1|sha256|sha384|sha512)=([0-9a-f]+)$/i);
  if (!m) return false;
  const expected = createHmac(m[1].toLowerCase(), secret).update(body).digest();
  const got = Buffer.from(m[2], "hex");
  return got.length === expected.length && timingSafeEqual(got, expected);
}

/** Constant-time string comparison, for bearer secrets. */
export function sameSecret(a: string, b: string): boolean {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
