import React from "react";

interface HeatmapBrushProps {
  brushStart: number | null;
  brushEnd: number | null;
  brushInfo: {
    start: string;
    end: string;
    duration: string;
  } | null;
}

export const HeatmapBrush: React.FC<HeatmapBrushProps> = ({
  brushStart,
  brushEnd,
  brushInfo,
}) => {
  if (brushStart === null || brushEnd === null) return null;

  const left = Math.min(brushStart, brushEnd);
  const width = Math.abs(brushEnd - brushStart);

  return (
    <>
      {/* Brush overlay */}
      <div
        className="absolute top-0 bottom-0 bg-white opacity-20"
        style={{
          left: `${left}px`,
          width: `${width}px`,
        }}
      />
      {/* Brush borders */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-blue-500"
        style={{
          left: `${left}px`,
        }}
      />
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-blue-500"
        style={{
          left: `${left + width}px`,
        }}
      />
      {/* Brush info tooltip */}
      {brushInfo && (
        <div
          className="absolute bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none"
          style={{
            left: `${left + width / 2}px`,
            top: "-25px",
            transform: "translate(-50%, -100%)",
          }}
        >
          {brushInfo.start} - {brushInfo.end} ({brushInfo.duration})
        </div>
      )}
    </>
  );
};
