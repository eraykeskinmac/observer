"use client";

import React from "react";
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
import { initialEdges, initialNodes } from "../initialData";

const nodeTypes = {
  application: ApplicationNode,
  collector: CollectorNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
        <Background color="#1e1e1e" gap={20} size={1} />
        <Controls showInteractive={false} />
        <Panel
          position="top-left"
          className="bg-[#1e1e1e] p-2 rounded-md text-white"
        >
          Environments
        </Panel>
      </ReactFlow>
    </div>
  );
}
