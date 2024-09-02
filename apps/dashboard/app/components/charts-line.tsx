"use client";
import { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";

interface P95DurationData {
  minute: string;
  p95_duration: string;
}

export default function ChartLine({ serviceName }: { serviceName: string }) {
  const [chartData, setChartData] = useState<P95DurationData[]>([]);

  useEffect(() => {
    async function fetchP95Duration() {
      try {
        const response = await fetch(
          `/api/latency-percentiles?serviceName=${encodeURIComponent(serviceName)}`
        );
        const data = await response.json();
        setChartData(
          data.map((item: P95DurationData) => ({
            time: new Date(item.minute).toLocaleTimeString(),
            p95: parseFloat(item.p95_duration),
          }))
        );
      } catch (error) {
        console.error("Error fetching p95 duration:", error);
      }
    }
    fetchP95Duration();
  }, [serviceName]);

  return (
    <Card className="w-full h-[400px] bg-zinc-950 text-zinc-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal flex items-center">
          <span className="font-medium mr-1">Span Duration</span>
          <span className="mx-2 text-zinc-500">/</span>
          <span className="text-zinc-400 mr-1">p95 /ms</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="p95Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                tickFormatter={(value) => `${value.toFixed(2)} ms`}
              />
              <Tooltip
                contentStyle={{
                  background: "#27272a",
                  border: "none",
                  borderRadius: "6px",
                }}
                itemStyle={{ color: "#ffffff" }}
                formatter={(value: number) => [
                  `${value.toFixed(2)} ms`,
                  "Duration p95",
                ]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="p95"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#p95Gradient)"
              />
              <Line
                type="monotone"
                dataKey="p95"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
