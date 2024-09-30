"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ServiceSelect } from "../../components/services-select";
import TraceDataTable from "../../components/trace-data-table";
import { CopilotChat } from "../../components/copilot-chat";
import Charts from "../../components/charts";
import ChartsLine from "../../components/charts-line";
import ChartsBar from "../../components/charts-bar";
import LatencyHeatmap from "../../components/heatmap-grid-charts";

interface ServiceData {
  ServiceName: string;
  Events: number;
}

export default function ServiceDetailPage({
  params,
}: {
  params: { serviceName: string };
}) {
  const router = useRouter();
  const [serviceData, setServiceData] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string>(
    decodeURIComponent(params.serviceName)
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/services");
        const data = await response.json();
        setServiceData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching service data:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleServiceChange = (serviceName: string) => {
    setSelectedService(serviceName);
    router.push(`/services/${encodeURIComponent(serviceName)}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 lg:p-8 relative bg-zinc-900 text-zinc-100 min-h-screen">
      <div className="absolute top-4 left-4">
        <ServiceSelect
          applicationNodes={serviceData.map((service, index) => ({
            id: `node-${index}`,
            data: { label: service.ServiceName, subLabel: "application" },
          }))}
          selectedService={selectedService}
          onServiceChange={handleServiceChange}
        />
      </div>
      <div className="absolute top-4 right-4">
        <CopilotChat serviceName={selectedService} />
      </div>
      <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 mt-16">
        {selectedService}
      </h1>
      <div className="mt-8 space-y-8">
        <LatencyHeatmap />
        <div>
          <h2 className="text-xl lg:text-2xl font-semibold mb-4">Metrics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Charts serviceName={selectedService} />
            <ChartsBar serviceName={selectedService} />
            <ChartsLine serviceName={selectedService} />
          </div>
        </div>
        <div>
          <h2 className="text-xl lg:text-2xl font-semibold mb-4">Traces</h2>
          <TraceDataTable serviceName={selectedService} />
        </div>
      </div>
    </div>
  );
}
