// Security utilities for Phase 1 client-side storage.
// Passwords are NEVER stored or compared in plain text.
// In Phase 2, authentication will be delegated to AWS Cognito.

const SALT_PREFIX = 'kaamconnect_v1_salt::';

export async function hashPassword(plainPassword: string): Promise<string> {
  const salted = `${SALT_PREFIX}${plainPassword}`;
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(salted);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback deterministic digest if Web Crypto is unavailable
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < salted.length; i++) {
    const ch = salted.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return `sha256_fb_${(4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16)}`;
}

export async function verifyPassword(plainPassword: string, storedHash: string): Promise<boolean> {
  const computed = await hashPassword(plainPassword);
  return computed === storedHash;
}
