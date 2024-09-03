import React from "react";
import { EdgeProps, getSmoothStepPath } from "@xyflow/react";

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 0,
  });

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: "#4f4f4f",
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {data?.label && (
        <foreignObject
          width={80}
          height={40}
          x={labelX - 40}
          y={labelY - 20}
          className="edgelabel-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div className="edgelabel-container">
            <p className="edgelabel-text">{data.label as string}</p>
          </div>
        </foreignObject>
      )}
    </>
  );
};

export default CustomEdge;
