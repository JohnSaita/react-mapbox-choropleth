import type { CountyProperties } from '../types';

const n = new Intl.NumberFormat('en-KE');

export default function InfoPanel({ county }: { county: CountyProperties | null }) {
  if (!county) {
    return <p className="info muted">Hover over a county to see its figures.</p>;
  }
  return (
    <dl className="info">
      <dt className="county-name">{county.county}</dt>
      <dd>
        <span>Population</span>
        <strong>{n.format(county.population)}</strong>
      </dd>
      <dd>
        <span>Area</span>
        <strong>{n.format(county.area_km2)} km²</strong>
      </dd>
      <dd>
        <span>Density</span>
        <strong>{n.format(Math.round(county.density))} / km²</strong>
      </dd>
    </dl>
  );
}
