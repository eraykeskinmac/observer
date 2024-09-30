import React from "react";
import { Checkbox } from "@ui/components/ui/checkbox";
import { Label } from "@ui/components/ui/label";

interface ColorBoxProps {
  color: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const ColorBox: React.FC<ColorBoxProps> = ({
  color,
  label,
  checked,
  onChange,
}) => (
  <div className="flex items-center space-x-2">
    <Checkbox
      id={label.toLowerCase()}
      checked={checked}
      onCheckedChange={onChange}
    />
    <div className="flex items-center space-x-1">
      <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
      <Label htmlFor={label.toLowerCase()} className="text-white text-xs">
        {label}
      </Label>
    </div>
    <div className="flex items-center space-x-1">
      <div
        className="w-2 h-4 rounded"
        style={{ backgroundColor: color, opacity: 0.2 }}
      />
      <div
        className="w-2 h-4 rounded"
        style={{ backgroundColor: color, opacity: 0.6 }}
      />
      <div className="w-2 h-4 rounded" style={{ backgroundColor: color }} />
      <span className="text-white text-xs">Less → More</span>
    </div>
  </div>
);
