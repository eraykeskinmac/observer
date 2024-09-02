"use client";

import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";

interface StatusCodeData {
  minute: string;
  GroupedStatus: string;
  count: number;
}

interface ChartData {
  time: string;
  OK?: number;
  ERROR?: number;
  UNSET?: number;
}

const colors = {
  OK: "#22c55e",
  ERROR: "#ef4444",
  UNSET: "#eab308",
};

export function ChartsBar({ serviceName }: { serviceName: string }) {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    async function fetchStatusCodeCounts() {
      try {
        const response = await fetch(
          `/api/error-rate-metrics?serviceName=${encodeURIComponent(serviceName)}`
        );
        const data: StatusCodeData[] = await response.json();

        const groupedData = data.reduce<Record<string, ChartData>>(
          (acc, item) => {
            const time = new Date(item.minute).toLocaleTimeString();
            if (!acc[time]) {
              acc[time] = { time };
            }
            acc[time][item.GroupedStatus as "OK" | "ERROR" | "UNSET"] =
              item.count;
            return acc;
          },
          {}
        );

        setChartData(Object.values(groupedData));
      } catch (error) {
        console.error("Error fetching status code counts:", error);
      }
    }

    fetchStatusCodeCounts();
  }, [serviceName]);

  return (
    <Card className="w-full h-[400px] bg-zinc-950 text-zinc-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal flex items-center">
          <span className="font-medium mr-1">Status Codes</span>
          <span className="mx-2 text-zinc-500">/</span>
          <span className="text-zinc-400 mr-1">Count</span>
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
                dataKey="time"
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
                formatter={(value, name) => [
                  `${value} requests`,
                  `Status ${name}`,
                ]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => (
                  <span style={{ color: colors[value as keyof typeof colors] }}>
                    {value}
                  </span>
                )}
              />
              {Object.keys(colors).map((status) => (
                <Bar
                  key={status}
                  dataKey={status}
                  stackId="a"
                  fill={colors[status as keyof typeof colors]}
                  name={status}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
