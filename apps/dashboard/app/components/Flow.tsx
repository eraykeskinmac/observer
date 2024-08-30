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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui/components/select";
import { Layers, ChevronDown } from "lucide-react";
import ApplicationNode from "./nodes/ApplicationNode";
import CollectorNode from "./nodes/CollectorNode";
import CustomEdge from "./edges/CustomEdge";
import { initialEdges, initialNodes } from "../initialData";
import { Button } from "@ui/components/button";
import { Badge } from "@ui/components/badge";

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
        <Panel position="top-left" className="flex space-x-2">
          <Select>
            <SelectTrigger className="w-[240px] bg-black text-white border-none shadow-none">
              <div className="flex items-center">
                <Layers className="mr-2 h-4 w-4" />
                <span className="flex-grow text-left">Environments</span>
                <Badge variant="outline" className="ml-2">
                  default
                </Badge>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-black text-white border-gray-800">
              <SelectGroup>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="development">Development</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Panel>
      </ReactFlow>
    </div>
  );
}
