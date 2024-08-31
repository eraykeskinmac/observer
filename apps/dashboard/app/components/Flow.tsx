// components/Flow.tsx
"use client";

import React, { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "../styles/flow.css";

import ApplicationNode from "./nodes/ApplicationNode";
import CollectorNode from "./nodes/CollectorNode";
import CustomEdge from "./edges/CustomEdge";
import { initialEdges, initialNodes, FlowNode, FlowEdge } from "../initialData";
import { ServiceSelect } from "./services-select";

const nodeTypes = {
  application: ApplicationNode,
  collector: CollectorNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export default function Flow() {
  const [nodes, setNodes, onNodesChange] =
    useNodesState<FlowNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] =
    useEdgesState<FlowEdge>(initialEdges);

  const applicationNodes = useMemo(
    () => nodes.filter((node) => node.type === "application"),
    [nodes]
  );

  return (
    <div className="w-full h-full turbo-flow">
      <ReactFlow
        colorMode="dark"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          minZoom: 0.5,
          maxZoom: 1,
        }}
        minZoom={0.1}
        maxZoom={4}
        defaultEdgeOptions={{
          type: "custom",
          animated: false,
          style: { strokeWidth: 2, stroke: "#4f4f4f" },
        }}
      >
        <Background gap={20} size={1} />
        <Controls showInteractive={false} />
        <Panel position="top-left" className="flex space-x-2">
          <ServiceSelect applicationNodes={applicationNodes} />
        </Panel>
      </ReactFlow>
    </div>
  );
}
