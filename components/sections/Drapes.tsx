/**
 * Tied-back drapes (v1.18): a frame for the hero. Two sage drapes, each cinched
 * at mid-height by a gold tieback (hourglass silhouette from an SVG mask,
 * fold-lined fabric), sit at the left/right edges of the hero — they scroll
 * away with it. They cinch into place as the cover curtain is drawn aside and
 * fades into them. Decorative and non-interactive.
 */
export function Drapes() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="drape drape-left">
        <div className="drape-fabric" />
        <div className="drape-tieback drape-tieback-left" />
      </div>
      <div className="drape drape-right">
        <div className="drape-fabric drape-fabric-flip" />
        <div className="drape-tieback drape-tieback-right" />
      </div>
    </div>
  );
}
