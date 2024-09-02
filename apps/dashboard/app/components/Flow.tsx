"use client";

import React, { useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "../styles/flow.css";
import ApplicationNode from "./nodes/ApplicationNode";
import CollectorNode from "./nodes/CollectorNode";
import CustomEdge from "./edges/CustomEdge";
import { ServiceSelect } from "./services-select";
import { useRouter, usePathname } from "next/navigation";

const nodeTypes = {
  application: ApplicationNode,
  collector: CollectorNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

interface ServiceName {
  ServiceName: string;
}

interface ServiceEvent {
  ServiceName: string;
  SpanCount: number;
}

type CustomNodeData = {
  label: string;
  subLabel: string;
  events?: number;
};

type CustomNode = Node<CustomNodeData>;

type CustomEdgeData = {
  label: string;
};

type CustomEdge = Edge<CustomEdgeData>;

export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchData() {
      try {
        const [serviceNamesResponse, serviceEventsResponse] = await Promise.all(
          [fetch("/api/services"), fetch("/api/service-metrics")]
        );

        const serviceNames: ServiceName[] = await serviceNamesResponse.json();
        const serviceEvents: ServiceEvent[] =
          await serviceEventsResponse.json();

        const collectorNode: CustomNode = {
          id: "collector",
          type: "collector",
          position: { x: 400, y: 400 },
          data: { label: "InfraStack AI", subLabel: "collector" },
        };

        const applicationNodes: CustomNode[] = serviceNames.map(
          (item, index) => {
            const eventData = serviceEvents.find(
              (event) => event.ServiceName === item.ServiceName
            );
            return {
              id: `node-${index}`,
              type: "application",
              position: { x: 300 * index, y: 100 },
              data: {
                label: item.ServiceName,
                subLabel: "application",
                events: eventData ? eventData.SpanCount : 0,
              },
            };
          }
        );

        const newEdges: CustomEdge[] = applicationNodes.map((node, index) => ({
          id: `edge-${index}`,
          source: node.id,
          target: "collector",
          type: "custom",
          data: { label: `${node.data.events} spans/m` },
        }));

        setNodes([collectorNode, ...applicationNodes]);
        setEdges(newEdges);
        setLoading(false);
        const currentService = serviceNames.find((service) =>
          pathname.includes(encodeURIComponent(service.ServiceName))
        );
        if (currentService) {
          setSelectedService(currentService.ServiceName);
        }
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    }

    fetchData();
  }, [pathname]);

  const handleServiceChange = (serviceName: string) => {
    setSelectedService(serviceName);
    router.push(`/services/${encodeURIComponent(serviceName)}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
          <ServiceSelect
            applicationNodes={nodes}
            selectedService={selectedService}
            onServiceChange={handleServiceChange}
          />
        </Panel>
      </ReactFlow>
    </div>
  );
}
