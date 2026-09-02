import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface ChartSeries {
  id: string;
  name: string;
  /** A `var(--viz-n)` reference, so the theme toggle needs no redraw. */
  color: string;
  points: number[];
}

interface ScenarioLineChartProps {
  series: ChartSeries[];
  /** Month labels, indexed the same as every series' points. */
  labels: string[];
  formatValue: (value: number) => string;
  /** Compact form for the y-axis, where space is tight. */
  formatTick: (value: number) => string;
  ariaSummary: string;
}

const HEIGHT = 300;
const PAD = { top: 16, right: 16, bottom: 30, left: 66 };
const FALLBACK_WIDTH = 720;

/**
 * Rounds an axis maximum up to a readable number, so a ₹50L loan tops out at
 * "₹50.00 L" rather than at the balance left after its first instalment.
 */
const niceMax = (value: number): number => {
  if (value <= 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalised = value / magnitude;
  const step = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((s) => normalised <= s) ?? 10;
  return step * magnitude;
};

/**
 * Multi-series line chart over months — one line per scenario.
 *
 * Plain SVG rather than a charting library: a 20-year loan is 240 points per
 * series over a linear axis, with no stacking, animation or zoom, so a library
 * would cost more in bundle than the whole page. Canvas was the other candidate
 * and loses here — it would need manual devicePixelRatio scaling, a full redraw
 * on every theme toggle, hand-rolled hit-testing, and it says nothing to a
 * screen reader.
 *
 * The width is measured rather than handed to `viewBox`, so axis labels stay at
 * a readable size on a phone instead of scaling down with the drawing.
 */
const ScenarioLineChart = ({
  series,
  labels,
  formatValue,
  formatTick,
  ariaSummary,
}: ScenarioLineChartProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(FALLBACK_WIDTH);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    // Guarded: react-snap renders this page in Puppeteer at build time.
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(280, entry.contentRect.width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const innerW = Math.max(1, width - PAD.left - PAD.right);
  const innerH = HEIGHT - PAD.top - PAD.bottom;

  const geometry = useMemo(() => {
    const lastIndex = labels.length - 1;
    if (lastIndex < 1 || series.length === 0) return null;

    let peak = 0;
    for (const s of series) for (const p of s.points) if (p > peak) peak = p;
    const max = niceMax(peak);

    const x = (i: number) => PAD.left + (i / lastIndex) * innerW;
    const y = (v: number) => PAD.top + innerH - (v / max) * innerH;

    const paths = series.map((s) => ({
      ...s,
      // A series that has already closed stops rather than running along zero,
      // so an early payoff reads as a line that ends, not one that flatlines.
      d: s.points
        .map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
        .join(' '),
      endIndex: s.points.length - 1,
    }));

    const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({ value: max * f, y: y(max * f) }));

    // Fewer date labels on a narrow screen — five of them collide at phone width.
    const tickCount = Math.min(innerW < 420 ? 3 : 5, labels.length);
    const xTicks = Array.from({ length: tickCount }, (_, k) => {
      const i = Math.round((k / (tickCount - 1)) * lastIndex);
      return { i, x: x(i), label: labels[i] };
    });

    return { x, y, paths, yTicks, xTicks, lastIndex };
  }, [series, labels, innerW, innerH]);

  const pickNearest = useCallback(
    (clientX: number) => {
      const el = wrapRef.current;
      if (!el || !geometry) return;
      const rect = el.getBoundingClientRect();
      const ratio = (clientX - rect.left - PAD.left) / innerW;
      const i = Math.round(ratio * geometry.lastIndex);
      setHover(Math.min(geometry.lastIndex, Math.max(0, i)));
    },
    [geometry, innerW]
  );

  if (!geometry) {
    return (
      <div className="h-48 grid place-items-center text-sm text-gray-500 dark:text-gray-400">
        Add a scenario to see the curve.
      </div>
    );
  }

  const hoverX = hover === null ? 0 : geometry.x(hover);
  // Keep the tooltip inside the plot rather than letting it hang off an edge.
  const tooltipLeft = Math.min(Math.max(hoverX, 96), Math.max(96, width - 96));

  return (
    <div className="relative" ref={wrapRef}>
      <svg
        width={width}
        height={HEIGHT}
        role="img"
        aria-label={ariaSummary}
        onMouseMove={(e) => pickNearest(e.clientX)}
        onMouseLeave={() => setHover(null)}
        onTouchStart={(e) => pickNearest(e.touches[0].clientX)}
        onTouchMove={(e) => pickNearest(e.touches[0].clientX)}
        onTouchEnd={() => setHover(null)}
        className="touch-pan-y select-none"
      >
        {geometry.yTicks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={PAD.left}
              x2={width - PAD.right}
              y1={tick.y}
              y2={tick.y}
              className="stroke-gray-200 dark:stroke-gray-700"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 10}
              y={tick.y + 4}
              textAnchor="end"
              className="fill-gray-500 dark:fill-gray-400"
              style={{ fontSize: 11 }}
            >
              {formatTick(tick.value)}
            </text>
          </g>
        ))}

        {geometry.xTicks.map((tick) => (
          <text
            key={tick.i}
            x={tick.x}
            y={HEIGHT - 10}
            textAnchor={tick.i === 0 ? 'start' : tick.i === geometry.lastIndex ? 'end' : 'middle'}
            className="fill-gray-500 dark:fill-gray-400"
            style={{ fontSize: 11 }}
          >
            {tick.label}
          </text>
        ))}

        {hover !== null && (
          <line
            x1={hoverX}
            x2={hoverX}
            y1={PAD.top}
            y2={HEIGHT - PAD.bottom}
            className="stroke-gray-400 dark:stroke-gray-500"
            strokeWidth={1}
          />
        )}

        {geometry.paths.map((s) => (
          <path
            key={s.id}
            d={s.d}
            fill="none"
            stroke={s.color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {hover !== null &&
          geometry.paths.map((s) =>
            hover <= s.endIndex ? (
              // A 2px surface ring keeps overlapping markers readable where two
              // scenarios cross.
              <circle
                key={s.id}
                cx={hoverX}
                cy={geometry.y(s.points[hover])}
                r={4}
                fill={s.color}
                strokeWidth={2}
                className="stroke-white dark:stroke-gray-900"
              />
            ) : null
          )}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute top-1 -translate-x-1/2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 shadow-lg text-xs"
          style={{ left: tooltipLeft }}
        >
          <p className="font-semibold text-gray-900 dark:text-white mb-1 whitespace-nowrap">
            {labels[hover]}
            <span className="font-normal text-gray-400"> · month {hover + 1}</span>
          </p>
          {series.map((s) => (
            <p
              key={s.id}
              className="flex items-center gap-1.5 whitespace-nowrap text-gray-600 dark:text-gray-300"
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: s.color }}
                aria-hidden="true"
              />
              <span className="truncate max-w-[9rem]">{s.name}</span>
              <span className="ml-auto pl-2 font-medium tabular-nums text-gray-900 dark:text-white">
                {hover < s.points.length ? formatValue(s.points[hover]) : 'closed'}
              </span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScenarioLineChart;
