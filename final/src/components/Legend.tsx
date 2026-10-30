import { COLORS, METRICS } from '../lib/choropleth';
import type { Metric } from '../types';

/** Horizontal stepped legend: one swatch per class, break values under the boundaries. */
export default function Legend({ metric }: { metric: Metric }) {
  const { label, unit, breaks, format } = METRICS[metric];
  return (
    <div className="legend" aria-label={`${label} legend`}>
      <p className="legend-title">
        {label} <span>({unit})</span>
      </p>
      <div className="legend-ramp">
        {COLORS.map((color) => (
          <span key={color} style={{ background: color }} />
        ))}
      </div>
      <div className="legend-labels">
        {breaks.map((b, i) => (
          <span key={b}>{i === breaks.length - 1 ? `${format(b)}+` : format(b)}</span>
        ))}
      </div>
    </div>
  );
}
