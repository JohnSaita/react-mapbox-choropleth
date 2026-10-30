import type { NationalTotals } from '../hooks/useCountyData';
import type { CountyProperties } from '../types';

const n = new Intl.NumberFormat('en-KE');

interface Props {
  county: CountyProperties | null;
  totals: NationalTotals | null;
}

/** Shows the hovered county, or national totals when nothing is hovered. */
export default function InfoPanel({ county, totals }: Props) {
  const name = county?.county ?? 'Kenya';
  const caption = county ? 'County' : `All ${totals?.counties ?? 47} counties · hover the map`;
  const stats = county ?? totals;

  return (
    <section className="card info" aria-live="polite">
      <p className="eyebrow">{caption}</p>
      <h2 className="info-name">{name}</h2>
      <dl className="stats">
        <div>
          <dt>Population</dt>
          <dd>{stats ? n.format(stats.population) : '—'}</dd>
        </div>
        <div>
          <dt>Area (km²)</dt>
          <dd>{stats ? n.format(stats.area_km2) : '—'}</dd>
        </div>
        <div>
          <dt>Density (/km²)</dt>
          <dd>{stats ? n.format(Math.round(stats.density)) : '—'}</dd>
        </div>
      </dl>
    </section>
  );
}
