import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { subMinutes, addMinutes, format } from "date-fns";
import { generateMockData } from "./utils";
import { UPDATE_INTERVAL } from "./constant";

export const useLatencyHeatmap = () => {
  const [showOk, setShowOk] = useState(true);
  const [showError, setShowError] = useState(true);
  const [data, setData] = useState(() => generateMockData(new Date()));
  const [endTime, setEndTime] = useState(new Date());
  const [brushStart, setBrushStart] = useState<number | null>(null);
  const [brushEnd, setBrushEnd] = useState<number | null>(null);
  const [isBrushing, setIsBrushing] = useState(false);
  const [zoomStack, setZoomStack] = useState<[Date, Date][]>([]);
  const [isZooming, setIsZooming] = useState(false);
  const heatmapRef = useRef<HTMLDivElement>(null);

  const currentZoomRange = useMemo(() => {
    return zoomStack.length > 0 ? zoomStack[zoomStack.length - 1] : null;
  }, [zoomStack]);

  const filteredData = useMemo(() => {
    let filtered = data.filter(
      (item) =>
        (showOk && item.status === "OK") ||
        (showError && item.status === "ERROR"),
    );
    if (currentZoomRange && Array.isArray(currentZoomRange)) {
      const [start, end] = currentZoomRange as [Date, Date];
      filtered = filtered.filter(
        (item) => new Date(item.time) >= start && new Date(item.time) <= end,
      );
    }
    return filtered;
  }, [data, showOk, showError, currentZoomRange]);

  const timeLabels = useMemo(() => {
    const start = currentZoomRange
      ? currentZoomRange[0]
      : subMinutes(endTime, 10);
    const end = currentZoomRange ? currentZoomRange[1] : endTime;
    return [0, 0.25, 0.5, 0.75, 1].map((ratio) =>
      format(
        new Date(start.getTime() + (end.getTime() - start.getTime()) * ratio),
        "HH:mm:ss",
      ),
    );
  }, [endTime, currentZoomRange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const heatmapRect = heatmapRef.current?.getBoundingClientRect();
    if (heatmapRect) {
      const startX = e.clientX - heatmapRect.left;
      setBrushStart(startX);
      setBrushEnd(null);
      setIsBrushing(true);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isBrushing && heatmapRef.current) {
        const heatmapRect = heatmapRef.current.getBoundingClientRect();
        const currentX = Math.max(
          0,
          Math.min(e.clientX - heatmapRect.left, heatmapRect.width),
        );
        setBrushEnd(currentX);
      }
    },
    [isBrushing],
  );

  const handleMouseUp = useCallback(() => {
    setIsBrushing(false);
    if (brushStart !== null && brushEnd !== null && heatmapRef.current) {
      const heatmapRect = heatmapRef.current.getBoundingClientRect();
      const start = currentZoomRange
        ? currentZoomRange[0]
        : subMinutes(endTime, 10);
      const end = currentZoomRange ? currentZoomRange[1] : endTime;
      const totalDuration = (end.getTime() - start.getTime()) / 1000;
      const startSeconds =
        (Math.min(brushStart, brushEnd) / heatmapRect.width) * totalDuration;
      const endSeconds =
        (Math.max(brushStart, brushEnd) / heatmapRect.width) * totalDuration;
      const zoomStart = new Date(start.getTime() + startSeconds * 1000);
      const zoomEnd = new Date(start.getTime() + endSeconds * 1000);

      setIsZooming(true);
      setTimeout(() => {
        setZoomStack((prevStack) => [...prevStack, [zoomStart, zoomEnd]]);
        setBrushStart(null);
        setBrushEnd(null);
        setIsZooming(false);
      }, 300);
    }
  }, [brushStart, brushEnd, endTime, currentZoomRange]);

  const resetZoom = useCallback(() => {
    setIsZooming(true);
    setTimeout(() => {
      setZoomStack([]);
      setBrushStart(null);
      setBrushEnd(null);
      setIsZooming(false);
    }, 300);
  }, []);

  const undoZoom = useCallback(() => {
    if (zoomStack.length > 0) {
      setIsZooming(true);
      setTimeout(() => {
        setZoomStack((prevStack) => prevStack.slice(0, -1));
        setIsZooming(false);
      }, 300);
    }
  }, [zoomStack]);

  useEffect(() => {
    const timer = setInterval(() => {
      const newEndTime = addMinutes(endTime, 5);
      setEndTime(newEndTime);
      setData(generateMockData(newEndTime));
    }, UPDATE_INTERVAL);

    return () => clearInterval(timer);
  }, [endTime]);

  const brushInfo = useMemo(() => {
    if (brushStart === null || brushEnd === null || !heatmapRef.current)
      return null;
    const heatmapRect = heatmapRef.current.getBoundingClientRect();
    const start = currentZoomRange
      ? currentZoomRange[0]
      : subMinutes(endTime, 10);
    const end = currentZoomRange ? currentZoomRange[1] : endTime;
    const totalDuration = (end.getTime() - start.getTime()) / 1000;
    const startSeconds =
      (Math.min(brushStart, brushEnd) / heatmapRect.width) * totalDuration;
    const endSeconds =
      (Math.max(brushStart, brushEnd) / heatmapRect.width) * totalDuration;
    const brushStartTime = new Date(start.getTime() + startSeconds * 1000);
    const brushEndTime = new Date(start.getTime() + endSeconds * 1000);
    return {
      start: format(brushStartTime, "HH:mm:ss"),
      end: format(brushEndTime, "HH:mm:ss"),
      duration: `${((endSeconds - startSeconds) / 60).toFixed(2)} minutes`,
    };
  }, [brushStart, brushEnd, currentZoomRange, endTime]);

  return {
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
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    timeLabels,
    brushStart,
    brushEnd,
  };
};
