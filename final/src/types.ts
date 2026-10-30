export type Metric = 'density' | 'population';

/** Properties carried by every county feature in public/data/kenya-counties.geojson */
export interface CountyProperties {
  code: number;
  county: string;
  population: number;
  area_km2: number;
  density: number;
}
