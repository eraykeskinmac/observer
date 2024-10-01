import React, { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";

interface OperationAnalyticsData {
  minute: string;
  SpanName: string;
  operation_count: number;
}

interface ChartData {
  time: string;
  [key: string]: string | number;
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#ffbb28",
  "#ff7300",
  "#aabbcc",
];

export default function Charts({ serviceName }: { serviceName: string }) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [operations, setOperations] = useState<string[]>([]);

  useEffect(() => {
    async function fetchOperationAnalytics() {
      try {
        const response = await fetch(
          `/api/operation-analytics?serviceName=${encodeURIComponent(serviceName)}`,
        );
        const data: OperationAnalyticsData[] = await response.json();

        const groupedData = data.reduce<Record<string, ChartData>>(
          (acc, item) => {
            const time = new Date(item.minute).toLocaleTimeString();
            if (!acc[time]) {
              acc[time] = { time };
            }
            acc[time][item.SpanName] = item.operation_count;
            return acc;
          },
          {},
        );

        const uniqueOperations = Array.from(
          new Set(data.map((item) => item.SpanName)),
        );
        setOperations(uniqueOperations);
        setChartData(Object.values(groupedData));
      } catch (error) {
        console.error("Error fetching operation analytics:", error);
      }
    }

    fetchOperationAnalytics();
  }, [serviceName]);

  return (
    <Card className="w-full h-[400px] bg-zinc-950 text-zinc-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal flex items-center">
          <span className="font-medium mr-1">Operation Analytics</span>
          <span className="mx-2 text-zinc-500">/</span>
          <span className="text-zinc-400 mr-1">Count per Operation</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
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
                formatter={(value) => [`${value} operations`, "Count"]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Legend />
              {operations.map((operation, index) => (
                <Line
                  key={operation}
                  type="monotone"
                  dataKey={operation}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8, strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
