import React, { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { AdminApiService } from '../../services/admin-api.service';
import { AdminUserProfile } from '../../types/admin.types';

interface AdminLoginViewProps {
  onLoginSuccess: (user: AdminUserProfile) => void;
  onExitToStorefront: () => void;
}

/**
 * AdminLoginView
 * Single Responsibility: Authenticates privileged administrators against `/api/v1/auth/login`
 * and retrieves a backend-signed HMAC-SHA256 JWT token.
 */
export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onLoginSuccess,
  onExitToStorefront,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await AdminApiService.login(email, password);
      onLoginSuccess(response.user);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Error de autenticación.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-warm-charcoal)',
        color: 'var(--color-pure-white)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: ' center',
        alignItems: 'center',
        padding: 'var(--spacing-24)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--color-pure-white)',
          color: 'var(--color-soft-black)',
          border: '1px solid var(--color-pure-white)',
          padding: 'clamp(28px, 4vw, 44px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--spacing-24)',
            paddingBottom: 'var(--spacing-16)',
            borderBottom: '1px solid var(--color-warm-charcoal)',
          }}
        >
          <img
            src="/assets/LUMERA-PNG.png"
            alt="LUMÉRA"
            style={{ height: '26px', width: 'auto', objectFit: 'contain' }}
          />
          <span
            className="badge-signal-blue"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <ShieldCheck size={12} />
            <span>SIGNED JWT AUTH</span>
          </span>
        </div>

        <p
          className="text-caption-editorial"
          style={{ marginBottom: '6px', color: 'var(--color-muted-slate)' }}
        >
          PRIVATE ATELIER CONSOLE // RESTRICTED ACCESS
        </p>
        <h1
          className="section-heading"
          style={{
            fontSize: '22px',
            marginBottom: 'var(--spacing-24)',
          }}
        >
          ACCESO DE ADMINISTRACIÓN
        </h1>

        {errorMessage && (
          <div
            role="alert"
            style={{
              backgroundColor: 'var(--color-warm-charcoal)',
              color: 'var(--color-pure-white)',
              padding: '12px 14px',
              marginBottom: 'var(--spacing-20)',
              fontFamily: 'var(--font-gt-america-mono)',
              fontSize: '11px',
              letterSpacing: '0.04em',
            }}
          >
            ERROR: {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--spacing-16)' }}>
            <label
              htmlFor="admin-email"
              className="text-caption-editorial"
              style={{
                display: 'block',
                marginBottom: '6px',
                color: 'var(--color-soft-black)',
              }}
            >
              CORREO ELECTRÓNICO AUTORIZADO
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lumera.co"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid var(--color-warm-charcoal)',
                backgroundColor: 'var(--color-pure-white)',
                fontFamily: 'var(--font-gt-america-mono)',
                fontSize: '12px',
                color: 'var(--color-soft-black)',
              }}
            />
          </div>

          <div style={{ marginBottom: 'var(--spacing-24)' }}>
            <label
              htmlFor="admin-password"
              className="text-caption-editorial"
              style={{
                display: 'block',
                marginBottom: '6px',
                color: 'var(--color-soft-black)',
              }}
            >
              CLAVE DE ACCESO
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid var(--color-warm-charcoal)',
                backgroundColor: 'var(--color-pure-white)',
                fontFamily: 'var(--font-gt-america-mono)',
                fontSize: '12px',
                color: 'var(--color-soft-black)',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="pill-btn pill-btn--brand"
            style={{
              width: '100%',
              marginBottom: 'var(--spacing-12)',
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            <Lock size={13} />
            <span>
              {isSubmitting
                ? 'VERIFICANDO FIRMA CRIPTOGRÁFICA...'
                : 'INGRESAR AL PANEL'}
            </span>
          </button>

          <button
            type="button"
            onClick={onExitToStorefront}
            className="pill-btn pill-btn--outline"
            style={{ width: '100%' }}
          >
            VOLVER A LA TIENDA PÚBLICA
          </button>
        </form>
      </div>
    </div>
  );
};
