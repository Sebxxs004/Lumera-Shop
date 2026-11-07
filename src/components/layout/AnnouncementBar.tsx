import React from 'react';

interface AnnouncementBarProps {
  onExploreClick: () => void;
}

/**
 * AnnouncementBar
 * Single Responsibility: Top architectural spec strip on Warm Charcoal (#24170f)
 * with GT America Mono 10px uppercase text (#ffffff) per Skills/DESIGN2.md.
 */
export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  onExploreClick,
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-warm-charcoal)',
        minHeight: '34px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px var(--spacing-16)',
      }}
    >
      <button
        type="button"
        onClick={onExploreClick}
        className="text-caption-editorial"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-pure-white)',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--spacing-8)',
          textAlign: 'center',
        }}
      >
        <span>
          SPEC 2026 // MODA BOUTIQUE &amp; LUMÉRA BEAUTY — ENVÍO DE CORTESÍA
          DESDE $180 USD [EXPLORAR]
        </span>
      </button>
    </div>
  );
};
