import { NextResponse } from "next/server";
import client from "../client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceName = searchParams.get("serviceName");

  if (!serviceName) {
    return new NextResponse("Service name is required", { status: 400 });
  }

  try {
    const result = await client.query({
      query: `
        SELECT
          Timestamp,
          ServiceName,
          Duration,
          SpanKind,
          StatusCode,
          SpanName,
          TraceId
        FROM
          default.otel_traces
        WHERE
          ServiceName = {serviceName:String}
        GROUP BY
          Timestamp,
          ServiceName,
          SpanKind,
          Duration,
          StatusCode,
          SpanName,
          TraceId
        ORDER BY
          Timestamp DESC
        LIMIT 100
      `,
      format: "JSONEachRow",
      query_params: {
        serviceName: serviceName,
      },
    });

    const data = await result.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Empty or invalid response from ClickHouse");
    }

    console.log(`Fetched trace data from ClickHouse for ${serviceName}`);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching trace data from ClickHouse:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
