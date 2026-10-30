import { COLORS, METRICS } from '../lib/choropleth';
import type { CountyProperties } from '../types';

const n = new Intl.NumberFormat('en-KE');

function colorFor(density: number) {
  const { breaks } = METRICS.density;
  let i = 0;
  while (i + 1 < breaks.length && density >= breaks[i + 1]) i++;
  return COLORS[i];
}

/** Densest vs sparsest county — the contrast the density view is built to show. */
export default function DensityRange({ counties }: { counties: CountyProperties[] }) {
  if (counties.length === 0) return null;
  const sorted = [...counties].sort((a, b) => b.density - a.density);
  const rows = [
    { label: 'Most dense', c: sorted[0] },
    { label: 'Least dense', c: sorted[sorted.length - 1] },
  ];

  return (
    <section className="card range">
      <p className="eyebrow">Density range</p>
      <ul>
        {rows.map(({ label, c }) => (
          <li key={label}>
            <span className="swatch" style={{ background: colorFor(c.density) }} />
            <span className="range-label">{label}</span>
            <strong>{c.county}</strong>
            <span className="num">{n.format(Math.round(c.density))} /km²</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
