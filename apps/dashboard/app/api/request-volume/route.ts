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
          toStartOfMinute(Timestamp) AS minute,
          count(*) AS span_count
        FROM otel_traces
        WHERE ServiceName = {serviceName:String}
        GROUP BY minute
        ORDER BY minute
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

    console.log("Fetched span counts from ClickHouse:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching span counts from ClickHouse:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
