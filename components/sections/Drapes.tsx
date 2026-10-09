/**
 * Tied-back drapes (v1.17): a persistent frame. Two sage drapes, each cinched
 * at mid-height by a gold tieback (hourglass silhouette from an SVG mask,
 * fold-lined fabric), stay at the left/right edges once the cover curtain is
 * drawn aside — framing the content like a theatre stage. Decorative and
 * non-interactive; sits above the page content (z-40) but below the cover
 * curtain (z-50), so it is revealed as the cover opens.
 */
export function Drapes() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40">
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
