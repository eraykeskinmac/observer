import React from "react";
import { Handle, Position } from "@xyflow/react";

const CollectorNode = ({ data }: any) => {
  return (
    <div className="react-flow__node-collector">
      <div className="node-label">{data.label}</div>
      <div className="node-sublabel">{data.subLabel}</div>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
    </div>
  );
};

export default CollectorNode;
