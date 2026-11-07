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
 * Single Responsibility: Custom accessible dropdown menu that replaces the native OS <select>
 * to strictly preserve the DESIGN.md aesthetic (pill trigger, flat elevation, zero system blue,
 * single chromatic brand color #c21863 on #ffffff paper-white canvas).
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
      {/* Pill Trigger Button */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`pill-btn ${isOpen ? 'pill-btn--brand' : 'pill-btn--outline'}`}
        style={{
          padding: 'var(--spacing-10) var(--spacing-20)',
          fontSize: 'var(--text-caption)',
          minWidth: '235px',
          justifyContent: 'space-between',
        }}
      >
        <span>{selectedOption.label}</span>
        <ChevronDown
          size={14}
          style={{
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* Custom Editorial Dropdown List */}
      {isOpen && (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: '100%',
            width: 'max-content',
            zIndex: 60,
            listStyle: 'none',
            backgroundColor: 'var(--surface-paper-white-canvas)',
            border: '1px solid var(--color-lumera-statement)',
            borderRadius: '22px',
            padding: 'var(--spacing-8)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
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
                    padding: 'var(--spacing-10) var(--spacing-16)',
                    borderRadius: 'var(--radius-buttons)',
                    border:
                      isHovered && !isSelected
                        ? '1px solid var(--color-lumera-mist)'
                        : '1px solid transparent',
                    backgroundColor: isSelected
                      ? 'var(--color-lumera-statement)'
                      : isHovered
                      ? 'var(--surface-fog-footer)'
                      : 'var(--color-paper-white)',
                    color: isSelected
                      ? 'var(--color-paper-white)'
                      : 'var(--color-lumera-statement)',
                    fontFamily: 'var(--font-soehne)',
                    fontSize: 'var(--text-caption)',
                    fontWeight: isSelected
                      ? 'var(--font-weight-bold)'
                      : 'var(--font-weight-regular)',
                    letterSpacing: 'var(--tracking-caption)',
                    textTransform: 'uppercase',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease, color 0.15s ease',
                  }}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check size={13} strokeWidth={2.5} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
