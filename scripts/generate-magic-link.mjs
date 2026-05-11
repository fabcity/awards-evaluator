#!/usr/bin/env node
/**
 * Generate a magic-link URL for a specific evaluator.
 *
 * Usage:
 *   JWT_SECRET=... MAGIC_LINK_BASE=https://evaluate.fab.city \
 *     node scripts/generate-magic-link.mjs <evaluatorRecordId>
 *
 * Outputs the full URL to stdout. The URL is valid for 30 days.
 */
import { SignJWT } from 'jose';

const [evaluatorId] = process.argv.slice(2);

if (!evaluatorId || !evaluatorId.startsWith('rec')) {
  console.error('Usage: node scripts/generate-magic-link.mjs <recXXXXXX>');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET env var');
  process.exit(1);
}
const base = process.env.MAGIC_LINK_BASE ?? 'https://evaluate.fab.city';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

const token = await new SignJWT({})
  .setProtectedHeader({ alg: 'HS256' })
  .setSubject(evaluatorId)
  .setIssuedAt()
  .setExpirationTime('30d')
  .sign(secret);

const url = `${base}/auth?t=${token}`;
console.log(url);
