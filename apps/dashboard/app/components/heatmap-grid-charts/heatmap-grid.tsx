import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/ui/tooltip";
import { getBackgroundColor, getLatencyRowIndex, formatTime } from "./utils";

interface HeatmapGridProps {
  data: any[];
  isZooming: boolean;
  latencyRanges: { min: number; max: number; label: string }[];
}

export const HeatmapGrid: React.FC<HeatmapGridProps> = ({
  data,
  isZooming,
  latencyRanges,
}) => {
  return (
    <>
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-0 w-14 flex flex-col justify-between text-xs text-gray-400">
        {latencyRanges.map(({ label }) => (
          <span key={label} className="text-right pr-2">
            {label}
          </span>
        ))}
      </div>

      {/* Heatmap grid */}
      <div
        className={`absolute left-14 right-0 top-0 bottom-0 grid grid-rows-6 gap-[1px] p-[1px] transition-opacity duration-300 ${
          isZooming ? "opacity-50" : "opacity-100"
        }`}
        style={{
          gridTemplateColumns: `repeat(${data.length}, 1fr)`,
        }}
      >
        {data.map((item, index) => {
          const rowIndex = getLatencyRowIndex(item.latency);
          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="w-full h-full rounded-[1px]"
                    style={{
                      gridColumn: index + 1,
                      gridRow: rowIndex + 1,
                      backgroundColor: getBackgroundColor(
                        item.status,
                        item.count
                      ),
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Time: {formatTime(new Date(item.time))}</p>
                  <p>Latency: {item.latency.toFixed(2)}ms</p>
                  <p>Count: {item.count}</p>
                  <p>Status: {item.status}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </>
  );
};
