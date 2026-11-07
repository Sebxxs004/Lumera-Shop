import React from 'react';

interface AnnouncementBarProps {
  onExploreClick: () => void;
}

/**
 * AnnouncementBar
 * Single Responsibility: Top-of-page utility strip in soft Pastel Pink (--color-lumera-pastel)
 * with responsive typography for mobile and desktop.
 */
export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  onExploreClick,
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-lumera-pastel)',
        borderBottom: '1px solid var(--color-lumera-mist)',
        minHeight: '38px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px var(--spacing-15)',
      }}
    >
      <button
        type="button"
        onClick={onExploreClick}
        className="text-caption-editorial"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-lumera-statement)',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--spacing-8)',
          textAlign: 'center',
          fontSize: 'clamp(10px, 2.5vw, 11px)',
        }}
      >
        <span>
          MODA BOUTIQUE &amp; LUMÉRA BEAUTY · ENVÍO DE CORTESÍA DESDE $180
        </span>
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
};
