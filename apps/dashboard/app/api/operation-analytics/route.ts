import { NextResponse } from "next/server";
import client from "../client";

export const config = {
  runtime: 'nodejs',
};

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
          toStartOfMinute(Timestamp) AS minute,
          SpanName,
          count(*) AS operation_count
        FROM otel_traces
        WHERE ServiceName = {serviceName:String}
        GROUP BY minute, SpanName
        ORDER BY minute, operation_count DESC
      `,
      format: "JSONEachRow",
      query_params: {
        serviceName: serviceName,
      },
    });

    const data = await result.json();
    if (!data) {
      throw new Error("Empty response from ClickHouse");
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching operation analytics from ClickHouse:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
