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
 * Single Responsibility: Renders editorial display headings per DESIGN.md
 * (Integral 35-45px weight 400, uppercase, tight line-height 0.92-1.0).
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
        maxWidth: align === 'center' ? '760px' : '100%',
        margin: align === 'center' ? '0 auto var(--spacing-30)' : '0 0 var(--spacing-30)',
      }}
    >
      {eyebrow && (
        <p
          className="text-caption-editorial"
          style={{
            color: 'var(--color-lumera-statement)',
            marginBottom: 'var(--spacing-10)',
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
            color: 'var(--color-carbon)',
            marginTop: 'var(--spacing-12)',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

