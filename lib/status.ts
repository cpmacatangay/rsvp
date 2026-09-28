/**
 * Status presentation (DESIGN §10 badges): Pending olive / Accepted sage /
 * Declined clay. Presentation-only; the dot companion is allowed in /admin as
 * real semantic state (DESIGN §14.4 keeps decorative dots banned elsewhere).
 */

export type RsvpStatusView =
  | { label: 'Pending'; className: string; dot: string }
  | { label: 'Accepted'; className: string; dot: string }
  | { label: 'Declined'; className: string; dot: string };

export function statusView(status: 'accepted' | 'declined' | null): RsvpStatusView {
  if (status === 'accepted') {
    return {
      label: 'Accepted',
      className: 'bg-primary-soft text-primary',
      dot: 'bg-primary',
    };
  }
  if (status === 'declined') {
    return {
      label: 'Declined',
      className: 'bg-[#F6E4DE] text-danger',
      dot: 'bg-danger',
    };
  }
  return {
    label: 'Pending',
    className: 'bg-warm text-ink-soft',
    dot: 'bg-ink-faint',
  };
}
