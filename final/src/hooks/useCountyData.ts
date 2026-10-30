import { useEffect, useState } from 'react';
import type { CountyProperties } from '../types';

export interface NationalTotals {
  counties: number;
  population: number;
  area_km2: number;
  density: number;
}

interface CountyData {
  counties: CountyProperties[];
  totals: NationalTotals;
}

/** Loads the same GeoJSON the map uses (served from browser cache) for the side panels. */
export function useCountyData(url = '/data/kenya-counties.geojson') {
  const [data, setData] = useState<CountyData | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then((res) => res.json())
      .then((fc: GeoJSON.FeatureCollection<GeoJSON.Geometry, CountyProperties>) => {
        if (cancelled) return;
        const counties = fc.features.map((f) => f.properties);
        const population = counties.reduce((sum, c) => sum + c.population, 0);
        const area_km2 = counties.reduce((sum, c) => sum + c.area_km2, 0);
        setData({
          counties,
          totals: { counties: counties.length, population, area_km2, density: population / area_km2 },
        });
      })
      .catch((err) => console.error('Failed to load county data', err));
    return () => {
      cancelled = true;
    };
  }, [url]);

  return data;
}
