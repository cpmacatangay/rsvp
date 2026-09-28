/**
 * Badge — semantic status pill only (DESIGN §10). Decorative eyebrows are
 * banned (DESIGN §14.4); the badge level is reserved for real state in the
 * admin dashboard and the confirmation card.
 */
type BadgeProps = {
  label: string;
  className?: string;
  /** aria-hidden color dot — only for real semantic state, never decoration */
  dot?: string | null;
};

export function Badge({ label, className = '', dot = null }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-body text-badge uppercase ${className}`}
    >
      {dot ? <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot}`} /> : null}
      {label}
    </span>
  );
}
