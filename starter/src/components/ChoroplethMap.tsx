import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { CountyProperties, Metric } from '../types';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const KENYA_BOUNDS: mapboxgl.LngLatBoundsLike = [
  [33.9, -4.8],
  [41.95, 5.1],
];

interface Props {
  metric: Metric;
  onHover: (county: CountyProperties | null) => void;
}

export default function ChoroplethMap({ metric, onHover }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // 1. Create the map once.
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      bounds: KENYA_BOUNDS,
      fitBoundsOptions: { padding: 40 },
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('load', () => {
      // 2. Add the county GeoJSON source
      // 3. Add the choropleth fill layer
      // 4. Add the county border layer
    });

    // 5. Hover interaction

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 6. Restyle when the metric changes

  return <div ref={containerRef} className="map" />;
}
