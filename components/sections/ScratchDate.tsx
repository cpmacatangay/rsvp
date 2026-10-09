'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { invitation } from '~/lib/config';

/**
 * Scratch-the-date (v1.1): three foil circles (MONTH · DAY · YEAR) the guest
 * erases with a pointer stroke; each circle pops when ≥55% erased; the third
 * reveals the celebration line behind a one-time subtle confetti burst.
 *
 * Mechanics, honestly:
 * - Each circle = a real <span> with the value + an overlay <canvas> (foil).
 *   Erasing = destination-out alpha strokes. Percent estimate = sampled grid
 *   of cleared pixels (getImageData every stroke-end, tiny: 88x88).
 * - Keyboard + AT: each circle is focusable; Enter/Space reveal instantly
 *   (scratch is pointer-only). The values are real DOM text underneath, so
 *   screen readers already have them.
 * - no-JS: the canvases never mount (client component) — but SSR renders the
 *   covers INSIDE canvas only… so <noscript> CSS hides nothing needed: the
 *   value spans are separate (always visible when no canvas covers them).
 * - Reduced motion: global override kills the pop/confetti transforms;
 *   confetti is additionally skipped as pure decoration.
 *
 * Regression note (2026-10-06): the confetti canvas used to gate visibility
 * on `celebrate && !allDone` (always hidden exactly when firing) and the
 * burst trigger lived inside a setState updater. Visibility is now simply
 * `celebrate`, and a single-fire effect keyed on `allDone` starts the burst
 * after the canvas is committed visible.
 */

type CircleKey = 'month' | 'day' | 'year';

const LABELS: Record<CircleKey, string> = {
  month: 'Month',
  day: 'Day',
  year: 'Year',
};

const VALUES: Record<CircleKey, string> = {
  month: invitation.dateParts.month,
  day: invitation.dateParts.day,
  year: invitation.dateParts.year,
};

const SIZE = 96; // css px (dpr-scaled canvas internally)
const THRESHOLD = 0.55;

export function ScratchDate() {
  const [revealed, setRevealed] = useState<Record<CircleKey, boolean>>({
    month: false,
    day: false,
    year: false,
  });
  const [celebrate, setCelebrate] = useState(false);
  const canvasRefs = useRef<Record<CircleKey, HTMLCanvasElement | null>>({
    month: null,
    day: null,
    year: null,
  });
  const confettiRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef<CircleKey | null>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // init foil covers
    (Object.keys(canvasRefs.current) as CircleKey[]).forEach((key) => {
      const canvas = canvasRefs.current[key];
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = SIZE * dpr;
      canvas.height = SIZE * dpr;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      paintFoil(ctx);
    });
  }, []);

  const allDone = revealed.month && revealed.day && revealed.year;

  // single-fire celebration: runs AFTER the canvas is committed visible
  useEffect(() => {
    if (!allDone || celebrate) return;
    setCelebrate(true);
    if (!reduced.current) {
      runConfetti(confettiRef.current);
    }
  }, [allDone, celebrate]);

  const scratchAt = useCallback((key: CircleKey, x: number, y: number) => {
    const canvas = canvasRefs.current[key];
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 22;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    // tiny jitter both axes = natural nail-scratch texture, one stroke seg
    ctx.lineTo(x + (Math.random() - 0.5) * 3, y + (Math.random() - 0.5) * 3);
    ctx.stroke();
  }, []);

  const estimateAndMaybeReveal = useCallback((key: CircleKey) => {
    const canvas = canvasRefs.current[key];
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = canvas.width / SIZE;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    let total = 0;
    const step = Math.max(4, Math.floor(8 * dpr)); // sparse sample grid
    for (let yy = 0; yy < canvas.height; yy += step) {
      for (let xx = 0; xx < canvas.width; xx += step) {
        total += 1;
        if (data[(yy * canvas.width + xx) * 4 + 3] === 0) cleared += 1;
      }
    }
    if (total === 0) return;
    if (cleared / total >= THRESHOLD) {
      setRevealed((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
    }
  }, []);

  function pointerPos(event: React.PointerEvent<HTMLCanvasElement>): { x: number; y: number } {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function onPointerDown(key: CircleKey, event: React.PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = key;
    const { x, y } = pointerPos(event);
    scratchAt(key, x, y);
  }

  function onPointerMove(key: CircleKey, event: React.PointerEvent<HTMLCanvasElement>) {
    if (drawing.current !== key) return;
    const { x, y } = pointerPos(event);
    scratchAt(key, x, y);
  }

  function onPointerUp(key: CircleKey) {
    if (drawing.current !== key) return;
    drawing.current = null;
    estimateAndMaybeReveal(key);
  }

  function revealByKey(key: CircleKey) {
    const canvas = canvasRefs.current[key];
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setRevealed((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  }

  return (
    <div>
      <p className="font-body text-caption text-ink-soft">{invitation.scratchHint}</p>

      <ul className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {(Object.keys(LABELS) as CircleKey[]).map((key) => (
          <li key={key} className="flex flex-col items-center gap-2">
            <div className="relative">
              <span
                className={`flex h-24 w-24 select-none items-center justify-center rounded-full border-[1.5px] border-line bg-card font-display text-h2 text-primary transition-transform duration-[450ms] ease-enter ${
                  revealed[key] ? 'scale-100' : 'scale-95 opacity-40'
                } motion-reduce:transition-none`}
                aria-hidden={revealed[key] ? undefined : true}
              >
                {VALUES[key]}
              </span>
              {!revealed[key] ? (
                <>
                  <canvas
                    ref={(node) => {
                      canvasRefs.current[key] = node;
                    }}
                    width={SIZE}
                    height={SIZE}
                    style={{ width: SIZE, height: SIZE, touchAction: 'none' }}
                    className="absolute inset-0 cursor-pointer rounded-full opacity-100"
                    role="button"
                    tabIndex={0}
                    aria-label={`Scratch or press Enter to reveal the ${LABELS[key].toLowerCase()}`}
                    onPointerDown={(event) => onPointerDown(key, event)}
                    onPointerMove={(event) => onPointerMove(key, event)}
                    onPointerUp={() => onPointerUp(key)}
                    onPointerLeave={() => onPointerUp(key)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        revealByKey(key);
                      }
                    }}
                  />
                  <span className="pointer-events-none absolute inset-x-0 -bottom-6 text-center font-body text-caption text-ink-faint">
                    {LABELS[key]}
                  </span>
                </>
              ) : (
                <span className="pointer-events-none absolute inset-x-0 -bottom-6 text-center font-body text-caption text-ink-soft">
                  {LABELS[key]}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* celebration: confetti canvas behind the text, once, on all-done */}
      <div aria-live="polite" className="relative mt-10 min-h-16 text-center">
        <canvas
          ref={confettiRef}
          width={640}
          height={420}
          className={`pointer-events-none absolute left-1/2 top-1/2 h-auto w-[min(92vw,640px)] -translate-x-1/2 -translate-y-1/2 ${
            celebrate ? '' : 'hidden'
          }`}
          aria-hidden="true"
        />
        <p
          className={`font-script text-[44px] leading-[1.25] text-primary transition-all duration-[1000ms] ease-enter sm:text-[56px] ${
            celebrate ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
        >
          {invitation.celebration}
        </p>
      </div>
    </div>
  );
}

/** Foil cover: sage wash + dithered gold flecks (painted once per canvas). */
function paintFoil(ctx: CanvasRenderingContext2D) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#5B6E4F';
  ctx.beginPath();
  ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
  ctx.fill();
  // flecks
  for (let i = 0; i < 70; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = (Math.random() * 0.46 + 0.02) * SIZE;
    const x = SIZE / 2 + Math.cos(angle) * radius;
    const y = SIZE / 2 + Math.sin(angle) * radius;
    ctx.fillStyle = i % 3 === 0 ? 'rgba(183,155,91,0.9)' : 'rgba(220,227,210,0.5)';
    ctx.beginPath();
    ctx.arc(x, y, 0.7 + Math.random() * 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(250,247,240,0.55)';
  ctx.font = '600 9px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SCRATCH', SIZE / 2, SIZE / 2 + 3);
}

/**
 * Subtle confetti: ONE burst of ~120 small shapes on a 640x420 stage from
 * just above the celebration line; transform/opacity-only frame math (no
 * layout reads), gentle gravity, physics in a rAF loop that self-stops at
 * ~4.2s with a soft tail fade.
 */
function runConfetti(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const COLORS = ['#5B6E4F', '#B79B5B', '#DCE3D2', '#8F9F7F'];
  const width = 640;
  const height = 420;
  /** v1.2 review: slow + luxurious — 120 pieces on a tall stage, staggered
   * entry, gentle gravity so the fall stays on screen ~3s with a soft tail */
  const pieces = Array.from({ length: 120 }, () => ({
    x: width / 2 + (Math.random() - 0.5) * 280,
    y: height / 2 - 140 + Math.random() * 70,
    vx: (Math.random() - 0.5) * 3.0,
    vy: -(Math.random() * 2.0 + 1.2),
    size: Math.random() * 3.8 + 1.8,
    color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.2,
  }));

  const started = performance.now();
  const DURATION = 4200;

  function frame(now: number) {
    const elapsed = now - started;
    ctx!.clearRect(0, 0, width, height);
    if (elapsed > DURATION) return; // one burst, self-stopping
    for (const p of pieces) {
      p.vy += 0.045; // slower gravity = longer, calmer fall
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      const t = Math.min(1, elapsed / DURATION);
      const alpha = Math.pow(1 - t, 0.85); // soft tail fade
      ctx!.save();
      ctx!.globalAlpha = alpha;
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rot);
      ctx!.fillStyle = p.color;
      ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.62);
      ctx!.restore();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
