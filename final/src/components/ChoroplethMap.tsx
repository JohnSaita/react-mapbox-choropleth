import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { fillColorExpression } from '../lib/choropleth';
import type { CountyProperties, Metric } from '../types';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const SOURCE_ID = 'counties';
const FILL_LAYER = 'counties-fill';
const LINE_LAYER = 'counties-line';
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
  // Refs let the one-time map event handlers read the latest props.
  const metricRef = useRef(metric);
  const onHoverRef = useRef(onHover);

  useEffect(() => {
    onHoverRef.current = onHover;
  }, [onHover]);

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
      // 2. Add the data. promoteId makes `code` the feature id for feature-state.
      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: '/data/kenya-counties.geojson',
        promoteId: 'code',
      });

      // Insert below the first label layer so place names stay readable.
      const firstLabel = map.getStyle().layers.find((l) => l.type === 'symbol')?.id;

      // 3. Fill layer coloured by a data-driven step expression.
      map.addLayer(
        {
          id: FILL_LAYER,
          type: 'fill',
          source: SOURCE_ID,
          paint: {
            'fill-color': fillColorExpression(metricRef.current),
            'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.95, 0.8],
          },
        },
        firstLabel,
      );

      // 4. County borders, thicker on hover.
      map.addLayer(
        {
          id: LINE_LAYER,
          type: 'line',
          source: SOURCE_ID,
          paint: {
            'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#0b1d33', '#ffffff'],
            'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 2.5, 0.8],
          },
        },
        firstLabel,
      );
    });

    // 5. Hover interaction with feature-state.
    let hoveredId: string | number | undefined;

    const clearHover = () => {
      if (hoveredId !== undefined) {
        map.setFeatureState({ source: SOURCE_ID, id: hoveredId }, { hover: false });
      }
      hoveredId = undefined;
    };

    map.on('mousemove', FILL_LAYER, (e) => {
      const feature = e.features?.[0];
      if (!feature || feature.id === undefined) return;
      if (feature.id !== hoveredId) {
        clearHover();
        hoveredId = feature.id;
        map.setFeatureState({ source: SOURCE_ID, id: hoveredId }, { hover: true });
      }
      map.getCanvas().style.cursor = 'pointer';
      onHoverRef.current(feature.properties as CountyProperties);
    });

    map.on('mouseleave', FILL_LAYER, () => {
      clearHover();
      map.getCanvas().style.cursor = '';
      onHoverRef.current(null);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 6. Restyle when the metric changes — no need to reload the data.
  useEffect(() => {
    metricRef.current = metric;
    const map = mapRef.current;
    if (map?.getLayer(FILL_LAYER)) {
      map.setPaintProperty(FILL_LAYER, 'fill-color', fillColorExpression(metric));
    }
  }, [metric]);

  return <div ref={containerRef} className="map" />;
}
