import { NextResponse } from "next/server";
import client from "../client";

export async function GET() {
  try {
    const result = await client.query({
      query: `
    SELECT
      ServiceName,
      COUNT(DISTINCT TraceId) AS SpanCount
    FROM default.otel_traces
    WHERE Timestamp >= now() - INTERVAL 1000 MINUTE
    GROUP BY ServiceName
      `,
      format: "JSONEachRow",
    });

    const data = await result.json();

    if (!data) {
      throw new Error("Empty response from ClickHouse");
    }

    console.log("Fetched event counts from ClickHouse:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching event counts from ClickHouse:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
