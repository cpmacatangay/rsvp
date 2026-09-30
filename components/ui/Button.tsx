import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';

/**
 * Button — DESIGN §10: 48px minimum, pill radius, one locked accent (sage).
 * Variants: primary (sage fill, ivory text), secondary (ivory fill, sage
 * outline), ghost (sage text). Trailing icons sit inside a nested circle
 * wrapper (high-end skill "button-in-button"), never naked next to the text.
 */
type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  href?: string;
  type?: 'button' | 'submit';
  onClick?: MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  /** icon rendered inside the nested trailing circle; must be decorative */
  trailingIcon?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const base =
  'inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 font-body text-body font-semibold transition-[background-color,color,transform] duration-150 ease-enter active:scale-[0.98] motion-reduce:active:scale-100 disabled:opacity-45 disabled:pointer-events-none';

const variants = {
  primary: 'bg-primary text-page-ivory hover:bg-primary-dark',
  secondary: 'bg-card text-primary border-[1.5px] border-primary hover:bg-primary-soft',
  ghost: 'bg-transparent text-primary hover:bg-warm',
} as const;

export function Button({
  children,
  variant = 'primary',
  href,
  type = 'button',
  onClick,
  disabled,
  trailingIcon,
  className = '',
  style,
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`;

  const inner = (
    <>
      <span>{children}</span>
      {trailingIcon ? (
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(47,42,32,0.10)]"
        >
          {trailingIcon}
        </span>
      ) : null}
    </>
  );

  if (href) {
    const external = href.startsWith('http');
    return (
      <a
        href={href}
        className={cls}
        style={style}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {inner}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} style={style}>
      {inner}
    </button>
  );
}
