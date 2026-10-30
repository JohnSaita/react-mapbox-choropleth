# Kenya Population Choropleth — React + Mapbox GL JS

Geo Intelligence Lab · Video 2 · finished code

A choropleth map of Kenya's 47 counties from the 2019 Census, built with React, TypeScript and Mapbox GL JS.

- Data-driven `step` expression for classed colours
- Toggle between population density and total population (restyles without reloading data)
- Hover highlight with `feature-state` + `promoteId`
- Dashboard layout: header with the metric toggle, full-height map with a docked legend, and a sidebar with county details, a top-10 table that ranks by the active metric (synced with map hover) and the density range

## Run it

```bash
npm install
cp .env.example .env   # paste your Mapbox public token (pk.…)
npm run dev
```

## Project structure

```
public/data/kenya-counties.geojson   47 counties: code, county, population, area_km2, density
scripts/prepare-data.mjs             joins census figures to boundaries, computes area + density, simplifies
scripts/population-2019.json         KNBS 2019 census totals per county
src/lib/choropleth.ts                classes, colours, step expression, legend rows
src/components/ChoroplethMap.tsx     map, source, layers, hover, metric restyle
src/components/Legend.tsx
src/components/InfoPanel.tsx         hovered county, or national totals
src/components/TopCountiesTable.tsx  top 10 by the active metric (density or population), highlights the hovered county
src/components/DensityRange.tsx      densest vs sparsest county (tall screens only)
src/hooks/useCountyData.ts           loads county data + national totals for the sidebar
src/App.tsx                          layout (header / map / sidebar) + state
```

## Rebuilding the data

```bash
curl -L -o raw-counties.geojson https://raw.githubusercontent.com/mikelmaron/kenya-election-data/master/data/counties.geojson
node scripts/prepare-data.mjs raw-counties.geojson
```

Area is computed from the boundary geometry with Turf, so densities differ slightly from KNBS published densities (which use land area).

## Data

- Population: Kenya National Bureau of Statistics, 2019 Kenya Population and Housing Census, Volume I
- Boundaries: [mikelmaron/kenya-election-data](https://github.com/mikelmaron/kenya-election-data)
