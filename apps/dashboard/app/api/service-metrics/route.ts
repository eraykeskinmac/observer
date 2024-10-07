import { NextResponse } from "next/server";
import { getClient } from "../client";



export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceName = searchParams.get("serviceName");
  try {
    const client = getClient();
    const result = await client.query({
      query: `
    SELECT
    ServiceName,
    COUNT(DISTINCT TraceId) AS SpanCount
    FROM default.otel_traces
    WHERE
     ServiceName = {serviceName:String}
      GROUP BY ServiceName

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
    console.error("Error fetching event counts from ClickHouse:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
