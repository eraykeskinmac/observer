import { NextResponse } from "next/server";
import { getClient } from "../client";



export async function GET() {

  try {
    const client = getClient();
    const result = await client.query({
      query: "SELECT DISTINCT ServiceName FROM default.otel_traces",
      format: "JSONEachRow",
    });

    const data = await result.json();

    if (!data) {
      throw new Error("Empty response from ClickHouse");
    }


    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data from ClickHouse:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
