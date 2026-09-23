import * as crypto from 'crypto';

const DJANGO_ITERATIONS = 600000;

export function verifyDjangoPassword(
  password: string,
  encoded: string,
): boolean {
  const parts = encoded.split('$');
  if (parts.length !== 4) return false;
  const [algorithm, iterationsStr, salt, digest] = parts;
  if (algorithm !== 'pbkdf2_sha256') return false;

  const iterations = parseInt(iterationsStr, 10);
  const derived = crypto
    .pbkdf2Sync(password, salt, iterations, 32, 'sha256')
    .toString('base64');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(derived),
      Buffer.from(digest),
    );
  } catch {
    return false;
  }
}

export function hashDjangoPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('base64url').slice(0, 22);
  const hash = crypto
    .pbkdf2Sync(password, salt, DJANGO_ITERATIONS, 32, 'sha256')
    .toString('base64');
  return `pbkdf2_sha256$${DJANGO_ITERATIONS}$${salt}$${hash}`;
}
