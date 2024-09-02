import { Node, Edge } from "@xyflow/react";

export interface NodeData {
  label: string;
  subLabel: "application" | "collector";
  [key: string]: unknown;
}

export type FlowNode = Node<NodeData>;
export type FlowEdge = Edge<{ label: string }>;

export const initialNodes: FlowNode[] = [];
export const initialEdges: FlowEdge[] = [];
