import { METRICS } from '../lib/choropleth';
import type { CountyProperties, Metric } from '../types';

const n = new Intl.NumberFormat('en-KE');
const TOP_N = 10;

const COLUMN: Record<Metric, string> = {
  density: 'People / km²',
  population: 'Population',
};

interface Props {
  counties: CountyProperties[];
  /** Ranks by whichever metric the map is showing. */
  metric: Metric;
  /** County currently hovered on the map — its row is highlighted. */
  hovered: CountyProperties | null;
}

export default function TopCountiesTable({ counties, metric, hovered }: Props) {
  const rows = [...counties].sort((a, b) => b[metric] - a[metric]).slice(0, TOP_N);
  const max = rows[0]?.[metric] ?? 1;
  const title = `Top ${TOP_N} by ${METRICS[metric].label.toLowerCase()}`;

  return (
    <section className="card top-table" aria-label={title}>
      <p className="eyebrow">Ranking</p>
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">County</th>
            <th scope="col" className="num">
              {COLUMN[metric]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c, i) => (
            <tr key={c.code} className={hovered?.code === c.code ? 'active' : undefined}>
              <td className="rank">{i + 1}</td>
              <td>
                {c.county}
                <span className="bar" style={{ width: `${(c[metric] / max) * 100}%` }} />
              </td>
              <td className="num">{n.format(Math.round(c[metric]))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
