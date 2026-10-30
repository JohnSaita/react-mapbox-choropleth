import { useState } from 'react';
import ChoroplethMap from './components/ChoroplethMap';
import InfoPanel from './components/InfoPanel';
import type { CountyProperties, Metric } from './types';
import './App.css';

export default function App() {
  const [metric] = useState<Metric>('density');
  const [hovered, setHovered] = useState<CountyProperties | null>(null);

  if (!import.meta.env.VITE_MAPBOX_TOKEN) {
    return (
      <p className="token-missing">
        Add <code>VITE_MAPBOX_TOKEN</code> to a <code>.env</code> file, then restart <code>npm run dev</code>.
      </p>
    );
  }

  return (
    <div className="app">
      <ChoroplethMap metric={metric} onHover={setHovered} />

      <aside className="panel">
        <p className="brand">Geo Intelligence Lab</p>
        <h1>Kenya by County</h1>
        <p className="muted">2019 Population and Housing Census</p>

        {/* TODO (video): metric toggle */}

        <InfoPanel county={hovered} />
      </aside>

      {/* TODO (video): legend */}

      <p className="credit">Data: KNBS 2019 Census. Boundaries: kenya-election-data (mikelmaron).</p>
    </div>
  );
}
