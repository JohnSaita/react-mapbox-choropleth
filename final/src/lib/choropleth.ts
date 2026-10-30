import type { ExpressionSpecification } from 'mapbox-gl';
import type { Metric } from '../types';

export interface MetricConfig {
  label: string;
  unit: string;
  /** Lower bound of each class. breaks[0] is the minimum. */
  breaks: number[];
  format: (value: number) => string;
}

/** 7-class sequential ramp (ColorBrewer OrRd). One colour per break. */
export const COLORS = [
  '#fff7ec',
  '#fee8c8',
  '#fdd49e',
  '#fdbb84',
  '#fc8d59',
  '#e34a33',
  '#b30000',
];

const whole = new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat('en-KE', { notation: 'compact', maximumFractionDigits: 1 });

export const METRICS: Record<Metric, MetricConfig> = {
  density: {
    label: 'Population density',
    unit: 'people per km²',
    breaks: [0, 25, 50, 100, 250, 500, 1000],
    format: (v) => whole.format(v),
  },
  population: {
    label: 'Total population',
    unit: 'people',
    breaks: [0, 400_000, 600_000, 800_000, 1_000_000, 1_500_000, 2_000_000],
    format: (v) => compact.format(v),
  },
};

/**
 * Builds a Mapbox `step` expression:
 *   ['step', ['get', metric], color0, break1, color1, break2, color2, ...]
 * Values below break1 get color0, values >= break1 get color1, and so on.
 */
export function fillColorExpression(metric: Metric): ExpressionSpecification {
  const { breaks } = METRICS[metric];
  const stops = breaks.slice(1).flatMap((value, i) => [value, COLORS[i + 1]]);
  return ['step', ['get', metric], COLORS[0], ...stops] as unknown as ExpressionSpecification;
}

/** Legend rows: "0 – 25", "25 – 50", ... "1,000+" */
export function legendItems(metric: Metric) {
  const { breaks, format } = METRICS[metric];
  return breaks.map((lower, i) => {
    const upper = breaks[i + 1];
    return {
      color: COLORS[i],
      label: upper === undefined ? `${format(lower)}+` : `${format(lower)} – ${format(upper)}`,
    };
  });
}
