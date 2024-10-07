import { NextResponse } from "next/server";
import { getClient } from "../client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceName = searchParams.get("serviceName");

  if (!serviceName) {
    return new NextResponse("Service name is required", { status: 400 });
  }

  try {
    const client = getClient();
    const result = await client.query({
      query: `
        SELECT
          Timestamp,
          ServiceName,
          SpanName,
          SpanId,
          ParentSpanId,
          TraceId,
          SpanKind,
          Duration,
          StatusCode
        FROM
          otel_traces
        WHERE
          ServiceName = {serviceName:String}
        ORDER BY
          Timestamp ASC
      `,
      format: "JSONEachRow",
      query_params: {
        serviceName: serviceName,
      },
    });

    const data = await result.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("Empty response from ClickHouse for service:", serviceName);
      return NextResponse.json([]);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching trace details from ClickHouse:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}