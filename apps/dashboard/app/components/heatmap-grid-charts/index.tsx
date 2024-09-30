import React from "react";
import { Card, CardContent } from "@ui/components/ui/card";
import { useLatencyHeatmap } from "./useLatencyHeatmap";
import { HeatmapControls } from "./heatmap-controls";
import { HeatmapGrid } from "./heatmap-grid";
import { HeatmapBrush } from "./heatmap-brush";
import { LATENCY_RANGES } from "./constant";

const LatencyHeatmap: React.FC = () => {
  const {
    data,
    filteredData,
    showOk,
    setShowOk,
    showError,
    setShowError,
    zoomStack,
    isZooming,
    undoZoom,
    resetZoom,
    brushInfo,
    heatmapRef,
    brushStart,
    brushEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    timeLabels,
  } = useLatencyHeatmap();

  return (
    <Card className="w-full bg-zinc-900 text-white">
      <CardContent className="pt-4 px-4 pb-10">
        <HeatmapControls
          showOk={showOk}
          setShowOk={setShowOk}
          showError={showError}
          setShowError={setShowError}
          zoomStack={zoomStack}
          isZooming={isZooming}
          undoZoom={undoZoom}
          resetZoom={resetZoom}
          filteredData={filteredData}
        />
        <div
          className="relative h-40 cursor-crosshair"
          ref={heatmapRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <HeatmapGrid
            data={filteredData}
            isZooming={isZooming}
            latencyRanges={LATENCY_RANGES}
          />
          <HeatmapBrush
            brushStart={brushStart}
            brushEnd={brushEnd}
            brushInfo={brushInfo}
          />
          {/* X-axis labels */}
          <div className="absolute left-14 right-0 bottom-[-25px] flex justify-between text-xs text-gray-400">
            {timeLabels.map((time, index) => (
              <span key={index} className="transform -translate-x-1/2">
                {time}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LatencyHeatmap;
