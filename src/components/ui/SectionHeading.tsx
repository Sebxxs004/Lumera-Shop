import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * SectionHeading
 * Single Responsibility: Two-tier architectural section header per Skills/DESIGN2.md
 * - Eyebrow: GT America Mono 10px, letter-spacing 0.093em, #151515, uppercase
 * - Heading: Nimbus Sans Extended weight 700, 40px, letter-spacing 4px, #151515, uppercase
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  size = 'md',
}) => {
  const headingClass =
    size === 'lg'
      ? 'display-heading-lg'
      : size === 'sm'
      ? 'display-heading-sm'
      : 'display-heading';

  return (
    <div
      style={{
        textAlign: align,
        maxWidth: align === 'center' ? '740px' : '100%',
        margin:
          align === 'center'
            ? '0 auto var(--spacing-36)'
            : '0 0 var(--spacing-36)',
      }}
    >
      {eyebrow && (
        <p
          className="text-caption-editorial"
          style={{
            color: 'var(--color-soft-black)',
            marginBottom: 'var(--spacing-8)',
          }}
        >
          {eyebrow}
        </p>
      )}
      <h2 className={headingClass}>{title}</h2>
      {subtitle && (
        <p
          className="text-body-sm-editorial"
          style={{
            color: 'var(--color-soft-black)',
            marginTop: 'var(--spacing-12)',
            opacity: 0.8,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
