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

// TODO (video): fillColorExpression(metric) and legendItems(metric)
