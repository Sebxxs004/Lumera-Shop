import { IncomingMessage } from 'node:http';
import { AuthTokenClaims, UserRole } from '../../src/types/admin.types';
import { CryptoService } from '../security/crypto.service';

/**
 * AuthMiddleware
 * Single Responsibility: Extracts and validates cryptographically signed JWT tokens
 * from incoming HTTP requests and enforces role-based access control (RBAC).
 */
export const AuthMiddleware = {
  extractClaims(req: IncomingMessage): AuthTokenClaims | null {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.slice(7).trim();
    if (!token) return null;
    return CryptoService.verifyToken(token);
  },

  requireRole(
    req: IncomingMessage,
    allowedRoles: UserRole[] = ['ADMIN']
  ): { authorized: true; claims: AuthTokenClaims } | { authorized: false; status: number; message: string } {
    const claims = this.extractClaims(req);
    if (!claims) {
      return {
        authorized: false,
        status: 401,
        message: 'No autorizado. Se requiere firma JWT válida.',
      };
    }

    if (!allowedRoles.includes(claims.role)) {
      return {
        authorized: false,
        status: 403,
        message: 'Acceso denegado. Privilegios insuficientes para esta operación.',
      };
    }

    return {
      authorized: true,
      claims,
    };
  },
};
