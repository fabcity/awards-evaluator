import 'server-only';
import { SignJWT, jwtVerify } from 'jose';

const SESSION_COOKIE = 'eval_session';
const MAGIC_LINK_VALID_DAYS = 30;
const SESSION_VALID_DAYS = 7;

function secret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('Missing JWT_SECRET');
  return new TextEncoder().encode(s);
}

export type SessionClaims = {
  sub: string; // evaluator record ID (recXXXXXXX)
};

// Sign a long-lived magic-link token (30 days)
export async function signMagicLinkToken(evaluatorId: string): Promise<string> {
  return await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(evaluatorId)
    .setIssuedAt()
    .setExpirationTime(`${MAGIC_LINK_VALID_DAYS}d`)
    .sign(secret());
}

// Sign a shorter-lived session token (7 days)
export async function signSessionToken(evaluatorId: string): Promise<string> {
  return await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(evaluatorId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_VALID_DAYS}d`)
    .sign(secret());
}

export async function verifyToken(token: string): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.sub !== 'string') return null;
    return { sub: payload.sub };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
export const SESSION_MAX_AGE_SECONDS = SESSION_VALID_DAYS * 24 * 60 * 60;
