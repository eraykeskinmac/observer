"use client";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardContent, CardTitle } from "@ui/components/card";

interface ServiceMetric {
  ServiceName: string;
  SpanCount: number;
}

const ChartsBar = ({ serviceName }: { serviceName: string }) => {
  const [chartData, setChartData] = useState<ServiceMetric[]>([]);

  useEffect(() => {
    async function fetchServiceMetrics() {
      try {
        const response = await fetch(
          `/api/service-metrics?serviceName=${serviceName}`
        );
        const data: ServiceMetric[] = await response.json();
        setChartData(data);
      } catch (error) {
        console.error("Error fetching service metrics:", error);
      }
    }

    fetchServiceMetrics();
  }, [serviceName]);

  return (
    <Card className="w-full h-[400px] bg-zinc-950 text-zinc-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal flex items-center">
          <span className="font-medium mr-1">Service Metrics</span>
          <span className="mx-2 text-zinc-500">/</span>
          <span className="text-zinc-400 mr-1">Span Counts</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#333"
              />
              <XAxis
                dataKey="ServiceName"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#27272a",
                  border: "none",
                  borderRadius: "6px",
                }}
                itemStyle={{ color: "#ffffff" }}
                cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                formatter={(value) => [`${value} spans`, "Span Count"]}
                labelFormatter={(label) => `Service: ${label}`}
              />
              <Legend />
              <Bar dataKey="SpanCount" fill="#3b82f6" name="Span Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartsBar;
