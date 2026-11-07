import React, { useState } from 'react';
import {
  MegaMenuFeaturedCard,
  MegaMenuSubcategoryItem,
  NavSectionConfig,
} from '../../data/navigation.data';

interface NavbarMegaMenuProps {
  section: NavSectionConfig;
  onSelectSubcategory: (item: MegaMenuSubcategoryItem) => void;
  onSelectFeaturedCard: (card: MegaMenuFeaturedCard) => void;
  onClose: () => void;
}

/**
 * NavbarMegaMenu
 * Single Responsibility: Renders the full-width ALIGNE-style mega-menu dropdown
 * with a vertical monospace subcategory column on the left and a 3-column
 * portrait Bestsellers showcase on the right.
 */
export const NavbarMegaMenu: React.FC<NavbarMegaMenuProps> = ({
  section,
  onSelectSubcategory,
  onSelectFeaturedCard,
  onClose,
}) => {
  const [hoveredSubId, setHoveredSubId] = useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  return (
    <div
      role="region"
      aria-label={`${section.label} submenu`}
      onMouseLeave={onClose}
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        width: '100%',
        backgroundColor: 'var(--color-pure-white)',
        borderTop: '1px solid var(--border-hairline)',
        borderBottom: '1px solid var(--color-warm-charcoal)',
        padding: '32px clamp(20px, 3.5vw, 44px) 44px',
        zIndex: 90,
        animation: 'megaMenuSlideDown 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <div
        className="mega-menu-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(200px, 250px) 1fr',
          gap: 'clamp(28px, 4vw, 64px)',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Vertical Subcategory & Filter List */}
        <ul
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '13px',
            margin: 0,
            padding: 0,
            listStyle: 'none',
          }}
        >
          {section.subcategories.map((sub) => {
            const isHovered = hoveredSubId === sub.id;
            return (
              <li key={sub.id}>
                <button
                  type="button"
                  onMouseEnter={() => setHoveredSubId(sub.id)}
                  onMouseLeave={() => setHoveredSubId(null)}
                  onClick={() => onSelectSubcategory(sub)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '2px 0',
                    fontFamily: 'var(--font-gt-america-mono)',
                    fontSize: '12px',
                    fontWeight: sub.isHighlight ? 700 : 400,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: isHovered
                      ? 'var(--color-signal-blue)'
                      : sub.isHighlight
                      ? 'var(--color-warm-charcoal)'
                      : 'var(--color-soft-black)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'color 0.16s ease, transform 0.16s ease',
                    transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                  }}
                >
                  <span>{sub.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right Area: 3 Large Full-Bleed Portrait Bestseller Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '20px',
          }}
        >
          {section.featuredCards.map((card) => {
            const isCardHovered = hoveredCardId === card.id;
            return (
              <article
                key={card.id}
                onMouseEnter={() => setHoveredCardId(card.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onClick={() => onSelectFeaturedCard(card)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {/* Full-bleed Portrait Image (0px radius) */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '3 / 3.85',
                    backgroundColor: 'var(--color-ash-gray)',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={card.image}
                    alt={card.editorialTitle}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
                      transform: isCardHovered ? 'scale(1.03)' : 'scale(1)',
                    }}
                  />

                  {/* Subtle Signal Blue Novelty / Bestseller Badge */}
                  <span
                    className="badge-signal-blue"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    }}
                  >
                    {card.badge}
                  </span>
                </div>

                {/* Editorial Label & Bestseller Product Subtitle Below Image */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-gt-america-mono)',
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.09em',
                      textTransform: 'uppercase',
                      color: isCardHovered
                        ? 'var(--color-signal-blue)'
                        : 'var(--color-soft-black)',
                      transition: 'color 0.16s ease',
                    }}
                  >
                    {card.editorialTitle}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-gt-america-mono)',
                      fontSize: '11px',
                      fontWeight: 400,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: 'var(--color-muted-slate)',
                    }}
                  >
                    {card.subtitle}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};
