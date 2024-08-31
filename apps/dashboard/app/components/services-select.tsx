"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/select";
import { Layers } from "lucide-react";
import { FlowNode } from "../initialData";
import { Badge } from "@ui/components/badge";

interface ServiceSelectProps {
  applicationNodes: FlowNode[];
}

export const ServiceSelect: React.FC<ServiceSelectProps> = ({
  applicationNodes,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    const currentId = pathname.split("/").pop();
    const currentNode = applicationNodes.find((node) => node.id === currentId);
    if (currentNode) {
      setSelectedService(currentNode.id);
    }
  }, [pathname, applicationNodes]);

  const handleApplicationSelect = (applicationId: string) => {
    setSelectedService(applicationId);
    router.push(`/environments/${applicationId}`);
  };

  const getServiceLabel = (id: string) => {
    const node = applicationNodes.find((node) => node.id === id);
    return node ? node.data.label : "";
  };

  return (
    <div>
      <Select
        onValueChange={handleApplicationSelect}
        value={selectedService || undefined}
      >
        <SelectTrigger className="w-full bg-secondary text-white border-none shadow-none py-1 px-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Layers className="mr-2 h-4 w-4" />
              <span className="text-left text-sm">Services</span>
            </div>
            {selectedService && (
              <Badge
                variant="default"
                className="mx-2 whitespace-nowrap overflow-visible"
              >
                {getServiceLabel(selectedService)}
              </Badge>
            )}
          </div>
        </SelectTrigger>
        <SelectContent className="bg-secondary text-white border-gray-800">
          <SelectGroup>
            {applicationNodes.map((node) => (
              <SelectItem key={node.id} value={node.id} className="text-sm">
                {node.data.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
