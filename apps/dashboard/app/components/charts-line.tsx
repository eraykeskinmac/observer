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

const data = [
  { time: "27:00", p95: 750, other: 20 },
  { time: "30:00", p95: 950, other: 25 },
  { time: "33:00", p95: 1100, other: 30 },
  { time: "36:00", p95: 10, other: 15 },
  { time: "39:00", p95: 1050, other: 22 },
  { time: "42:00", p95: 850, other: 18 },
  { time: "45:00", p95: 20, other: 12 },
  { time: "48:00", p95: 1000, other: 28 },
  { time: "51:00", p95: 1050, other: 24 },
];

export default function ChartLine() {
  return (
    <Card className="w-full h-[400px] bg-zinc-950 text-zinc-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal flex items-center">
          <span className="font-medium mr-1">Span name</span>
          <ChevronDown className="h-4 w-4" />
          <span className="mx-2 text-zinc-500">/</span>
          <span className="text-zinc-400 mr-1">Duration p95 /ms</span>
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
              data={data}
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
                formatter={(value) => [`${value} ms`, "Duration p95"]}
              />
              <Line
                type="linear"
                dataKey="p95"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="linear"
                dataKey="other"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
