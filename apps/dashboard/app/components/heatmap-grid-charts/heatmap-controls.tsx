import React from "react";
import { Button } from "@ui/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/ui/tooltip";
import { RotateCcw, Undo2 } from "lucide-react";
import { ColorBox } from "./color-box";
import { formatNumber } from "./utils";

interface HeatmapControlsProps {
  showOk: boolean;
  setShowOk: (show: boolean) => void;
  showError: boolean;
  setShowError: (show: boolean) => void;
  zoomStack: [Date, Date][];
  isZooming: boolean;
  undoZoom: () => void;
  resetZoom: () => void;
  filteredData: any[];
}

export const HeatmapControls: React.FC<HeatmapControlsProps> = ({
  showOk,
  setShowOk,
  showError,
  setShowError,
  zoomStack,
  isZooming,
  undoZoom,
  resetZoom,
  filteredData,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <ColorBox
          color="rgb(128, 128, 128)"
          label="OK & UNSET"
          checked={showOk}
          onChange={(checked) => setShowOk(checked === true)}
        />
        <ColorBox
          color="rgb(220, 38, 38)"
          label="ERROR"
          checked={showError}
          onChange={(checked) => setShowError(checked)}
        />
        <div className="space-x-2 text-sm text-gray-400">
          <span>
            # of spans:{" "}
            {formatNumber(
              filteredData.reduce((sum, item) => sum + item.count, 0)
            )}
          </span>
          <span>Zoom Level: {zoomStack.length}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {zoomStack.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={undoZoom}
                  variant="outline"
                  size="sm"
                  disabled={isZooming}
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo Zoom</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {zoomStack.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={resetZoom}
                  variant="outline"
                  size="sm"
                  disabled={isZooming}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset Zoom</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};
