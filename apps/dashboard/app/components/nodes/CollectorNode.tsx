import React from "react";
import { Handle, Position } from "@xyflow/react";

const CollectorNode = ({ data }: any) => {
  return (
    <div>
      <div className="node-label flex items-center">
        <span className="collector-icon">🐙</span>
        {data.label}
      </div>
      <div className="node-sublabel">{data.subLabel}</div>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
    </div>
  );
};

export default CollectorNode;
