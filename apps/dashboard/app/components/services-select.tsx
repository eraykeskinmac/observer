import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/select";
import { Badge } from "@ui/components/badge";

interface FlowNode {
  id: string;
  data: {
    label: string;
    subLabel: string;
  };
}

interface ServiceSelectProps {
  applicationNodes: FlowNode[];
  selectedService: string | null;
  onServiceChange: (serviceName: string) => void;
}

export const ServiceSelect: React.FC<ServiceSelectProps> = ({
  applicationNodes,
  selectedService,
  onServiceChange,
}) => {
  const handleChange = (value: string) => {
    const selectedNode = applicationNodes.find((node) => node.id === value);
    if (selectedNode) {
      onServiceChange(selectedNode.data.label);
    }
  };

  const selectedNodeId = applicationNodes.find(
    (node) => node.data.label === selectedService
  )?.id;

  return (
    <Select onValueChange={handleChange} value={selectedNodeId}>
      <SelectTrigger className="w-full bg-secondary text-white border-none shadow-none py-1 px-2">
        <SelectValue placeholder="Select a service" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {applicationNodes
            .filter((node) => node.data.subLabel === "application")
            .map((node) => (
              <SelectItem key={node.id} value={node.id}>
                {node.data.label}
                <Badge className="mx-3">{node.data.subLabel}</Badge>
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
