import { NextResponse } from "next/server";
import client from "../client";

export const config = {
  runtime: 'edge',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceName = searchParams.get("serviceName");

  if (!serviceName) {
    return new NextResponse("Service name and Trace ID are required", {
      status: 400,
    });
  }

  try {
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
      throw new Error("Empty or invalid response from ClickHouse");
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching trace details from ClickHouse:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
