"use client";

import React from "react";
import {
  Bar,
  BarChart,
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
  { time: "27:00", a: 5000, b: 4000, c: 1000, d: 500, e: 200, f: 100 },
  { time: "30:00", a: 3500, b: 3000, c: 1500, d: 700, e: 300, f: 200 },
  { time: "33:00", a: 4000, b: 2500, c: 2000, d: 800, e: 400, f: 300 },
  { time: "36:00", a: 300, b: 200, c: 100, d: 50, e: 30, f: 20 },
  { time: "39:00", a: 2500, b: 2000, c: 500, d: 300, e: 200, f: 100 },
  { time: "42:00", a: 3000, b: 2500, c: 1000, d: 500, e: 300, f: 200 },
  { time: "45:00", a: 100, b: 50, c: 30, d: 20, e: 10, f: 5 },
  { time: "48:00", a: 2000, b: 1500, c: 1000, d: 500, e: 300, f: 200 },
  { time: "51:00", a: 2500, b: 2000, c: 1000, d: 500, e: 300, f: 200 },
];

const colors = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#0088FE",
  "#00C49F",
];

export default function ChartsBar() {
  return (
    <Card className="w-full h-[400px] bg-zinc-950 text-zinc-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal flex items-center">
          <span className="font-medium mr-1">Span name</span>
          <ChevronDown className="h-4 w-4" />
          <span className="mx-2 text-zinc-500">/</span>
          <span className="text-zinc-400 mr-1">Count</span>
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
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              barSize={20}
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
                cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
              />
              {data[0] &&
                Object.keys(data[0])
                  .filter((key) => key !== "time")
                  .map((key, index) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      stackId="a"
                      fill={colors[index]}
                    />
                  ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
