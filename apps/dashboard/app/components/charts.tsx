"use client";

import React from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import { Button } from "@ui/components/button";
import { Expand, ChevronDown } from "lucide-react";

const chartData = [
  { time: "27:00", requests: 2500, duration: 1700, other: 900 },
  { time: "30:00", requests: 2800, duration: 1900, other: 1100 },
  { time: "33:00", requests: 3500, duration: 2800, other: 2500 },
  { time: "36:00", requests: 2700, duration: 2000, other: 1800 },
  { time: "39:00", requests: 3300, duration: 2500, other: 2000 },
  { time: "42:00", requests: 3000, duration: 2700, other: 1500 },
  { time: "45:00", requests: 2200, duration: 1500, other: 1000 },
  { time: "48:00", requests: 2600, duration: 2000, other: 1200 },
  { time: "51:00", requests: 2800, duration: 2400, other: 2000 },
];

const chartConfig = {
  requests: { label: "Requests", color: "#8884d8" },
  duration: { label: "Duration", color: "#82ca9d" },
  other: { label: "Other", color: "#ffc658" },
};

export default function Charts() {
  return (
    <Card className="w-full h-[400px] bg-zinc-950 text-zinc-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal flex items-center">
          <span className="font-medium mr-1">Requests</span>
          <ChevronDown className="h-4 w-4" />
          <span className="mx-2 text-zinc-500">/</span>
          <span className="text-zinc-400 mr-1">Duration /ms</span>
          <ChevronDown className="h-4 w-4 text-zinc-400" />
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-zinc-50"
        >
          <Expand className="h-4 w-4" />
          <span className="sr-only">Expand</span>
        </Button>
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
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  background: "#27272a",
                  border: "none",
                  borderRadius: "6px",
                }}
                itemStyle={{ color: "#ffffff" }}
                cursor={{ stroke: "#666" }}
              />
              {Object.entries(chartConfig).map(([key, config]) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={config.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
