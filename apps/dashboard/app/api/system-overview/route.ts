import { NextResponse } from "next/server";
import { getClient } from "../client";

export async function GET() {
  try {
    const client = getClient();
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

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("Empty or invalid response from ClickHouse for system overview");
      return NextResponse.json([]);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching system overview from ClickHouse:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}