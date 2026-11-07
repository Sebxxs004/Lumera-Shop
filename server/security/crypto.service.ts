import crypto from 'node:crypto';
import { AuthTokenClaims, UserRole } from '../../src/types/admin.types';
import { SecurityConfig } from '../config/security.config';

/**
 * CryptoService
 * Single Responsibility: Server-side cryptographic operations:
 * 1. Password hashing & verification (scrypt + timingSafeEqual)
 * 2. JWT HMAC-SHA256 token signing & verification
 * 3. Payload integrity signatures for catalog & accounting ledger entries
 */
export const CryptoService = {
  hashPassword(plainPassword: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = crypto
      .scryptSync(plainPassword, salt, 64)
      .toString('hex');
    return `${salt}:${derivedKey}`;
  },

  verifyPassword(plainPassword: string, storedHash: string): boolean {
    const [salt, keyHex] = storedHash.split(':');
    if (!salt || !keyHex) return false;
    const derivedBuffer = crypto.scryptSync(plainPassword, salt, 64);
    const keyBuffer = Buffer.from(keyHex, 'hex');
    if (derivedBuffer.length !== keyBuffer.length) return false;
    return crypto.timingSafeEqual(derivedBuffer, keyBuffer);
  },

  signToken(payload: {
    sub: string;
    email: string;
    fullName: string;
    role: UserRole;
  }): { token: string; expiresAt: number } {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + SecurityConfig.TOKEN_TTL_SECONDS;
    const claims: AuthTokenClaims = {
      ...payload,
      iat,
      exp,
    };

    const headerB64 = Buffer.from(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' })
    ).toString('base64url');
    const payloadB64 = Buffer.from(JSON.stringify(claims)).toString(
      'base64url'
    );
    const unsignedToken = `${headerB64}.${payloadB64}`;

    const signature = crypto
      .createHmac('sha256', SecurityConfig.JWT_SECRET)
      .update(unsignedToken)
      .digest('base64url');

    return {
      token: `${unsignedToken}.${signature}`,
      expiresAt: exp * 1000,
    };
  },

  verifyToken(token: string): AuthTokenClaims | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const [headerB64, payloadB64, signatureB64] = parts;
      const unsignedToken = `${headerB64}.${payloadB64}`;

      const expectedSignature = crypto
        .createHmac('sha256', SecurityConfig.JWT_SECRET)
        .update(unsignedToken)
        .digest('base64url');

      const sigBuf = Buffer.from(signatureB64);
      const expectedBuf = Buffer.from(expectedSignature);
      if (
        sigBuf.length !== expectedBuf.length ||
        !crypto.timingSafeEqual(sigBuf, expectedBuf)
      ) {
        return null;
      }

      const claims = JSON.parse(
        Buffer.from(payloadB64, 'base64url').toString('utf8')
      ) as AuthTokenClaims;

      const nowSeconds = Math.floor(Date.now() / 1000);
      if (!claims.exp || claims.exp < nowSeconds) {
        return null;
      }

      return claims;
    } catch {
      return null;
    }
  },

  signPayloadIntegrity(data: unknown): string {
    return crypto
      .createHmac('sha256', SecurityConfig.JWT_SECRET)
      .update(JSON.stringify(data))
      .digest('hex');
  },
};
