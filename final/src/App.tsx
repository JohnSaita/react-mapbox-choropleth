import { useState } from 'react';
import ChoroplethMap from './components/ChoroplethMap';
import DensityRange from './components/DensityRange';
import Legend from './components/Legend';
import InfoPanel from './components/InfoPanel';
import TopCountiesTable from './components/TopCountiesTable';
import { useCountyData } from './hooks/useCountyData';
import { METRICS } from './lib/choropleth';
import type { CountyProperties, Metric } from './types';
import './App.css';

const METRIC_OPTIONS: Metric[] = ['density', 'population'];

export default function App() {
  const [metric, setMetric] = useState<Metric>('density');
  const [hovered, setHovered] = useState<CountyProperties | null>(null);
  const data = useCountyData();

  if (!import.meta.env.VITE_MAPBOX_TOKEN) {
    return (
      <p className="token-missing">
        Add <code>VITE_MAPBOX_TOKEN</code> to a <code>.env</code> file, then restart <code>npm run dev</code>.
      </p>
    );
  }

  return (
    <div className="layout">
      <header className="topbar">
        <div className="title">
          <p className="brand">Geo Intelligence Lab</p>
          <h1>
            Kenya by County <span>· 2019 Population and Housing Census</span>
          </h1>
        </div>

        <div className="toggle" role="group" aria-label="Map metric">
          {METRIC_OPTIONS.map((m) => (
            <button key={m} aria-pressed={metric === m} onClick={() => setMetric(m)}>
              {METRICS[m].label}
            </button>
          ))}
        </div>
      </header>

      <main className="map-area">
        <ChoroplethMap metric={metric} onHover={setHovered} />
        <Legend metric={metric} />
      </main>

      <aside className="sidebar">
        <InfoPanel county={hovered} totals={data?.totals ?? null} />
        <TopCountiesTable counties={data?.counties ?? []} metric={metric} hovered={hovered} />
        <DensityRange counties={data?.counties ?? []} />
        <p className="credit">
          Data: KNBS 2019 Census, Vol. I · Boundaries: kenya-election-data
        </p>
      </aside>
    </div>
  );
}
