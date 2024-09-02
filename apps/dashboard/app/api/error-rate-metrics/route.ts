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
          CASE
            WHEN StatusCode = 'STATUS_CODE_OK' THEN 'OK'
            WHEN StatusCode = 'STATUS_CODE_ERROR' THEN 'ERROR'
            ELSE 'UNSET'
          END AS GroupedStatus,
          count() AS count
        FROM
          otel_traces
        WHERE ServiceName = {serviceName:String}
        GROUP BY
          minute,
          GroupedStatus
        ORDER BY
          minute
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

    console.log("Fetched status code counts from ClickHouse:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching status code counts from ClickHouse:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
