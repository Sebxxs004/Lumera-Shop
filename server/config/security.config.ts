/**
 * SecurityConfig
 * Single Responsibility: Server-side security parameters, JWT signing secret,
 * and initial administrator bootstrap credentials.
 */
export const SecurityConfig = {
  JWT_SECRET:
    process.env.LUMERA_JWT_SECRET ??
    'lumera-atelier-hmac-sha256-signing-secret-2026-v1',
  TOKEN_TTL_SECONDS: 60 * 60 * 12, // 12 hours
  DEFAULT_ADMIN_EMAIL: process.env.LUMERA_ADMIN_EMAIL ?? 'admin@lumera.co',
  DEFAULT_ADMIN_PASSWORD:
    process.env.LUMERA_ADMIN_PASSWORD ?? 'LumeraAtelier2026!',
  DEFAULT_ADMIN_NAME: 'Dirección General LUMÉRA',
  MAX_UPLOAD_BYTES: 8 * 1024 * 1024, // 8 MB per uploaded image
};
