// One-off data prep: join 2019 census population onto county boundaries,
// compute area + density, simplify geometry, write public/data/kenya-counties.geojson.
//
// Usage: node scripts/prepare-data.mjs <raw-counties.geojson>
// Raw boundaries: https://github.com/mikelmaron/kenya-election-data (data/counties.geojson)

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import area from '@turf/area';

const rawPath = process.argv[2];
if (!rawPath) throw new Error('Pass the raw counties GeoJSON path');

const raw = JSON.parse(readFileSync(rawPath, 'utf8'));
const population = JSON.parse(readFileSync(new URL('./population-2019.json', import.meta.url), 'utf8'));

// Raw names are upper case with a few spelling differences from KNBS.
const NAME_FIXES = {
  'ELEGEYO-MARAKWET': 'Elgeyo-Marakwet',
  'THARAKA - NITHI': 'Tharaka-Nithi',
  'TAITA TAVETA': 'Taita-Taveta',
};
const titleCase = (s) =>
  s.toLowerCase().replace(/(^|[\s-])(\w)/g, (_, sep, c) => sep + c.toUpperCase());

const features = [];
for (const f of raw.features) {
  const rawName = f.properties.COUNTY_NAM;
  if (!rawName) continue; // drop the unnamed sliver polygon
  const county = NAME_FIXES[rawName] ?? titleCase(rawName);
  const pop = population[county];
  if (pop === undefined) throw new Error(`No population for ${county}`);
  const areaKm2 = area(f) / 1e6;
  features.push({
    type: 'Feature',
    properties: {
      code: f.properties.COUNTY_COD,
      county,
      population: pop,
      area_km2: Math.round(areaKm2),
      density: Math.round((pop / areaKm2) * 10) / 10,
    },
    geometry: f.geometry,
  });
}
if (features.length !== 47) throw new Error(`Expected 47 counties, got ${features.length}`);

mkdirSync('scripts/tmp', { recursive: true });
mkdirSync('public/data', { recursive: true });
writeFileSync('scripts/tmp/joined.geojson', JSON.stringify({ type: 'FeatureCollection', features }));

// Simplify for the web (keeps shared borders topologically clean).
execFileSync('npx', [
  'mapshaper', 'scripts/tmp/joined.geojson',
  '-simplify', '8%', 'keep-shapes',
  '-o', 'public/data/kenya-counties.geojson', 'precision=0.0001', 'format=geojson',
], { stdio: 'inherit' });

const total = features.reduce((s, f) => s + f.properties.population, 0);
console.log(`Wrote 47 counties. Total population: ${total.toLocaleString()}`);
