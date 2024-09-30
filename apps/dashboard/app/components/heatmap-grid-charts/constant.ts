export const LATENCY_RANGES = [
  { min: 2100, max: Infinity, label: "≥ 2.10s" },
  { min: 1800, max: 2100, label: "1.80s" },
  { min: 1450, max: 1800, label: "1.45s" },
  { min: 1020, max: 1450, label: "1.02s" },
  { min: 580, max: 1020, label: "580ms" },
  { min: 145, max: 580, label: "145ms" },
];

export const GRID_COLUMNS = 250;
export const UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
