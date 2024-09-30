import { format, subMinutes, addMinutes } from "date-fns";
import { GRID_COLUMNS, LATENCY_RANGES } from "./constant";

export const formatTime = (time: Date) => format(time, "HH:mm:ss");

export const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + "k";
  }
  return num.toString();
};

export const getBackgroundColor = (status: string, count: number) => {
  const maxCount = 5;

  if (status === "ERROR") {
    const opacity = Math.min(count / maxCount, 1);
    return `rgba(220, 38, 38, ${opacity})`;
  } else {
    if (count === 0) {
      return "rgb(128, 128, 128)";
    } else {
      const grayValue = Math.floor(128 + (127 * count) / maxCount);
      return `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
    }
  }
};

export const getLatencyRowIndex = (latency: number) => {
  return LATENCY_RANGES.findIndex(
    (range) => latency >= range.min && latency < range.max
  );
};

export const generateMockData = (endTime: Date) => {
  const startTime = subMinutes(endTime, 10);
  return Array.from({ length: GRID_COLUMNS }, (_, i) => {
    const time = addMinutes(startTime, (i * 10) / GRID_COLUMNS);
    return {
      time: time.toISOString(),
      latency: Math.random() * 2955 + 145, // 145ms to 3100ms
      count: Math.floor(Math.random() * 5) + 1,
      status: Math.random() > 0.95 ? "ERROR" : "OK",
    };
  });
};
