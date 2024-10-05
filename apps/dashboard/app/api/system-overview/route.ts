import { NextResponse } from "next/server";
import client from "../client";

export const config = {
  runtime: 'edge',
};

export async function GET() {
  try {
    const result = await client.query({
      query: `
        SELECT
          ServiceName,
          count(DISTINCT TraceId) AS TraceCount,
          count(*) AS SpanCount,
          avg(Duration) AS AvgDuration,
          max(Duration) AS MaxDuration
        FROM otel_traces
        WHERE Timestamp >= now() - INTERVAL 1 HOUR
        GROUP BY ServiceName
      `,
      format: "JSONEachRow",
    });

    const data = await result.json();
    if (!data) {
      throw new Error("Empty response from ClickHouse");
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching system overview from ClickHouse:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
