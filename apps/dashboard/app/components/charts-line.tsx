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

interface PerformanceData {
  minute: string;
  avg_duration: number;
  max_duration: number;
  p95_duration: number;
}

const formatYAxisTick = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(2);
};

export default function ChartsLine({ serviceName }: { serviceName: string }) {
  const [chartData, setChartData] = useState<PerformanceData[]>([]);

  useEffect(() => {
    async function fetchPerformanceData() {
      try {
        const response = await fetch(
          `/api/performance-insights?serviceName=${encodeURIComponent(serviceName)}`
        );
        const data = await response.json();

        console.log("API'den gelen veri:", data);

        const formattedData = data.map((item: PerformanceData) => ({
          time: new Date(item.minute).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          avg: item.avg_duration / 1000, // Saniyeye çeviriyoruz
          max: item.max_duration / 1000,
          p95: item.p95_duration / 1000,
        }));

        console.log("Formatlanmış veri:", formattedData);

        setChartData(formattedData);
      } catch (error) {
        console.error("Performance verisi alınırken hata oluştu:", error);
      }
    }
    fetchPerformanceData();
  }, [serviceName]);

  return (
    <Card className="w-full h-[400px] bg-zinc-950 text-zinc-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal flex items-center">
          <span className="font-medium mr-1">Performance Insights</span>
          <span className="mx-2 text-zinc-500">/</span>
          <span className="text-zinc-400 mr-1">Duration (s)</span>
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
                tickFormatter={formatYAxisTick}
              />
              <Tooltip
                contentStyle={{
                  background: "#27272a",
                  border: "none",
                  borderRadius: "6px",
                }}
                itemStyle={{ color: "#ffffff" }}
                formatter={(value: number) => [
                  `${value.toFixed(2)} s`,
                  "Duration",
                ]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="p95"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#p95Gradient)"
                name="95th Percentile"
              />
              <Line
                type="monotone"
                dataKey="avg"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8, strokeWidth: 2 }}
                name="Average"
              />
              <Line
                type="monotone"
                dataKey="max"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8, strokeWidth: 2 }}
                name="Maximum"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
