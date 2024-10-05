import { NextRequest } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
import client from "../../client";



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const tableSchema = `
CREATE TABLE IF NOT EXISTS otel_traces
(
    Timestamp DateTime64(9),
    TraceId String,
    SpanId String,
    ParentSpanId String,
    TraceState String,
    SpanName String,
    SpanKind String,
    ServiceName String,
    ResourceAttributes Map(String, String),
    ScopeName String,
    ScopeVersion String,
    SpanAttributes Map(String, String),
    Duration Int64,
    StatusCode String,
    StatusMessage String,
    Events Nested
    (
        Timestamp DateTime64(9),
        Name String,
        Attributes Map(String, String)
    ),
    Links Nested
    (
        TraceId String,
        SpanId String,
        TraceState String,
        Attributes Map(String, String)
    )
) ENGINE = MergeTree()
ORDER BY (ServiceName, TraceId, SpanId);
`;

export async function POST(
  req: NextRequest,
  { params }: { params: { service: string } },
) {
  const { messages } = await req.json();
  const serviceName = params.service;

  if (!serviceName) {
    return new Response(JSON.stringify({ error: "Service name is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }


  const sqlQueryResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an SQL query generator for a ClickHouse database with the following schema:

${tableSchema}

You are analyzing data for the '${serviceName}' service. Always include 'ServiceName = '${serviceName}'' in your WHERE clause.
Generate SQL queries to answer the user's question about telemetry data. Include queries to get:
1. The span/count ratio for each SpanName
2. The total number of spans
3. The time range of the data
4. The distribution of status codes
5. The average duration for each SpanName
Do not provide any explanation, just the SQL queries.`,
      },
      ...messages,
    ],
  });

  let sqlQueries = sqlQueryResponse.choices[0]?.message?.content?.trim() ?? "";

  // Remove any additional text or explanation from the SQL queries
  sqlQueries = sqlQueries.replace(/^Here is your SQL query.*?\n\n/, "").trim();

  if (!sqlQueries) {
    throw new Error("Failed to generate SQL queries");
  }


  let queryResults = [];
  try {
    const queries = sqlQueries
      .split(";")
      .filter((query) => query.trim() !== "");
    for (const query of queries) {
      const result = await client.query({
        query: query.trim(),
        format: "JSONEachRow",
      });
      queryResults.push(await result.json());
    }
  } catch (error) {
    console.error("ClickHouse query error:", error);
    queryResults = [
      { error: "An error occurred while querying the database." },
    ];
  }

  const finalResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that interprets telemetry data for the '${serviceName}' service. You have just executed the following SQL queries:

${sqlQueries}

And received the following results:

${JSON.stringify(queryResults, null, 2)}

Please provide a detailed analysis of these results in response to the user's question. Your analysis should include:
1. An explanation of the span/count ratio for each SpanName and what it indicates about the service's behavior
2. The total number of spans analyzed and what this suggests about the service's activity level
3. The time range of the analyzed data and how this affects the interpretation of the results
4. Insights into the types of operations (SpanNames) occurring in the service and their relative frequency
5. Analysis of the status code distribution and what it indicates about the service's health
6. Interpretation of the average duration for each SpanName, highlighting any potential performance issues
7. Any potential performance insights or anomalies that can be derived from the data
8. Suggestions for further investigation or optimization based on these results
9. Recommendations for visualizations that could help in understanding the data better

If there was an error or if the results are empty, explain possible reasons why and suggest next steps for investigation. Be sure to use technical language appropriate for a DevOps or SRE professional, but also explain any complex concepts. Your goal is to provide actionable insights that can help improve the service's performance and reliability.`,
      },
      ...messages,
    ],
    stream: true,
  });

  const stream = OpenAIStream(finalResponse);
  return new StreamingTextResponse(stream);
}
