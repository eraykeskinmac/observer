"use client";

import React, { useMemo } from "react";
import { FlowNode, initialNodes } from "../../initialData";
import { ServiceSelect } from "../../components/services-select";
import { notFound } from "next/navigation";
import Charts from "../../components/charts";
import ChartsBar from "../../components/charts-bar";
import ChartLine from "../../components/charts-line";
import TraceDataTable from "../../components/trace-data-table";

interface EnvironmentPageProps {
  params: { id: string };
}

export default function EnvironmentPage({ params }: EnvironmentPageProps) {
  const applicationNodes = useMemo(
    () =>
      initialNodes.filter(
        (node): node is FlowNode => node.type === "application"
      ),
    []
  );

  const selectedApplication = useMemo(
    () => applicationNodes.find((node) => node.id === params.id),
    [applicationNodes, params.id]
  );

  if (!selectedApplication) {
    notFound();
  }

  return (
    <div className="p-4 lg:p-8 relative bg-zinc-900 text-zinc-100 min-h-screen">
      <div className="absolute top-4 left-4">
        <ServiceSelect applicationNodes={applicationNodes} />
      </div>
      <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 mt-16">
        {selectedApplication.data.label}
      </h1>
      <div className="mt-8 space-y-8">
        <div>
          <h2 className="text-xl lg:text-2xl font-semibold mb-4">Metrics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Charts />
            <ChartsBar />
            <ChartLine />
          </div>
        </div>
        <div>
          <h2 className="text-xl lg:text-2xl font-semibold mb-4">Traces</h2>
          <TraceDataTable />
        </div>
      </div>
    </div>
  );
}
