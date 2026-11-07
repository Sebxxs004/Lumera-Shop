import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface PillDropdownOption<T extends string> {
  value: T;
  label: string;
}

interface PillDropdownProps<T extends string> {
  options: PillDropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
}

/**
 * PillDropdown
 * Single Responsibility: Sharp 0px architectural dropdown menu per Skills/DESIGN2.md
 * (GT America Mono 11px uppercase, #24170f active fill, #ececec hover band, 0px radius).
 */
export function PillDropdown<T extends string>({
  options,
  value,
  onChange,
  ariaLabel = 'Seleccionar opción',
}: PillDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredValue, setHoveredValue] = useState<T | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    options.find((opt) => opt.value === value) ?? options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {/* Sharp 0px Trigger Button */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`pill-btn ${isOpen ? 'pill-btn--brand' : 'pill-btn--outline'}`}
        style={{
          padding: '10px 18px',
          fontSize: '10px',
          letterSpacing: '0.093em',
          minWidth: '220px',
          justifyContent: 'space-between',
        }}
      >
        <span>{selectedOption.label}</span>
        <ChevronDown
          size={13}
          style={{
            transition: 'transform 0.18s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* Architectural 0px Dropdown Menu */}
      {isOpen && (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            right: 0,
            minWidth: '100%',
            width: 'max-content',
            zIndex: 60,
            listStyle: 'none',
            backgroundColor: 'var(--color-pure-white)',
            border: '1px solid var(--color-warm-charcoal)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            const isHovered = hoveredValue === opt.value;

            return (
              <li key={opt.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onMouseEnter={() => setHoveredValue(opt.value)}
                  onMouseLeave={() => setHoveredValue(null)}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--spacing-12)',
                    padding: '11px 16px',
                    border: 'none',
                    borderBottom: '1px solid var(--color-ash-gray)',
                    backgroundColor: isSelected
                      ? 'var(--color-warm-charcoal)'
                      : isHovered
                      ? 'var(--color-ash-gray)'
                      : 'var(--color-pure-white)',
                    color: isSelected
                      ? 'var(--color-pure-white)'
                      : 'var(--color-soft-black)',
                    fontFamily: 'var(--font-gt-america-mono)',
                    fontSize: '10px',
                    fontWeight: isSelected
                      ? 'var(--font-weight-medium)'
                      : 'var(--font-weight-regular)',
                    letterSpacing: '0.093em',
                    textTransform: 'uppercase',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check size={12} strokeWidth={2} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
