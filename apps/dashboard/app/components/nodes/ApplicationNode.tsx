import React from "react";
import { Handle, Position } from "@xyflow/react";

const ApplicationNode = ({ data }: any) => {
  return (
    <div>
      <div className="node-label">{data.label}</div>
      <div className="node-sublabel">{data.subLabel}</div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
};

export default ApplicationNode;
