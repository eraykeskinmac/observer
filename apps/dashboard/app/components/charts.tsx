"use client";

import React, { useEffect, useState } from "react";
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

interface SpanCountData {
  minute: string;
  span_count: number;
}

export default function Charts({ serviceName }: { serviceName: string }) {
  const [chartData, setChartData] = useState<SpanCountData[]>([]);

  useEffect(() => {
    async function fetchSpanCounts() {
      try {
        const response = await fetch(
          `/api/request-volume?serviceName=${encodeURIComponent(serviceName)}`
        );
        const data = await response.json();
        setChartData(
          data.map((item: SpanCountData) => ({
            time: new Date(item.minute).toLocaleTimeString(),
            spans: item.span_count,
          }))
        );
      } catch (error) {
        console.error("Error fetching span counts:", error);
      }
    }

    fetchSpanCounts();
  }, [serviceName]);

  return (
    <Card className="w-full h-[400px] bg-zinc-950 text-zinc-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal flex items-center">
          <span className="font-medium mr-1">Spans</span>
          <span className="mx-2 text-zinc-500">/</span>
          <span className="text-zinc-400 mr-1">Count</span>
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
                <linearGradient id="spanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
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
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  background: "#27272a",
                  border: "none",
                  borderRadius: "6px",
                }}
                itemStyle={{ color: "#ffffff" }}
                formatter={(value) => [`${value} spans`, "Count"]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="spans"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#spanGradient)"
              />
              <Line
                type="monotone"
                dataKey="spans"
                stroke="#8884d8"
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
