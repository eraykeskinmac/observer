import { Node, Edge } from "@xyflow/react";

export const initialNodes: Node[] = [
  {
    id: "1",
    type: "application",
    position: { x: 0, y: 0 },
    data: { label: "test-python", subLabel: "application" },
  },
  {
    id: "2",
    type: "application",
    position: { x: 350, y: 0 },
    data: { label: "nextjs-replit-infrastackai", subLabel: "application" },
  },
  {
    id: "3",
    type: "application",
    position: { x: 700, y: 0 },
    data: { label: "infrastack-frontend", subLabel: "application" },
  },
  {
    id: "4",
    type: "collector",
    position: { x: 350, y: 250 },
    data: { label: "InfraStack AI", subLabel: "collector" },
  },
];

export const initialEdges: Edge[] = [
  {
    id: "e1-4",
    source: "1",
    target: "4",
    type: "custom",
    data: { label: "0 events /m" },
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
    type: "custom",
    data: { label: "0 events /m" },
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    type: "custom",
    data: { label: "0.5k events /m" },
  },
];
