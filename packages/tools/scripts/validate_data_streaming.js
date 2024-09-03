const { createClient } = require("@clickhouse/client");
const dotenv = require("dotenv");

dotenv.config({ path: "../../../.env" });

const client = createClient({
  host: process.env.CLICKHOUSE_ENDPOINT,
  database: process.env.CLICKHOUSE_DATABASE,
  username: process.env.CLICKHOUSE_USERNAME,
  password: process.env.CLICKHOUSE_PASSWORD,
});

async function validateDataStreaming() {
  console.log("Validating data streaming to ClickHouse...");

  try {
    const countQuery = await client.query({
      query: "SELECT COUNT(*) as count FROM otel_traces",
      format: "JSONEachRow",
    });
    const countData = await countQuery.json();
    console.log(`Found ${countData[0].count} records in ClickHouse.`);

    const latestDataQuery = await client.query({
      query: "SELECT MAX(Timestamp) as latest FROM otel_traces",
      format: "JSONEachRow",
    });
    const latestData = await latestDataQuery.json();
    console.log(
      `Latest data received at ${new Date(latestData[0].latest).toLocaleString()}`
    );

    const spanNamesQuery = await client.query({
      query: "SELECT DISTINCT SpanName FROM otel_traces LIMIT 10",
      format: "JSONEachRow",
    });
    const spanNames = await spanNamesQuery.json();
    console.log(
      "Span names found:",
      spanNames.map((row) => row.SpanName).join(", ")
    );

    const largePayloadQuery = await client.query({
      query:
        "SELECT COUNT(*) as count FROM otel_traces WHERE length(SpanAttributes) > 1000",
      format: "JSONEachRow",
    });
    const largePayloadData = await largePayloadQuery.json();
    console.log(
      `Number of spans with large payloads: ${largePayloadData[0].count}`
    );

    const serviceNamesQuery = await client.query({
      query: "SELECT DISTINCT ServiceName FROM otel_traces LIMIT 5",
      format: "JSONEachRow",
    });
    const serviceNames = await serviceNamesQuery.json();
    console.log(
      "Service names found:",
      serviceNames.map((row) => row.ServiceName).join(", ")
    );

    const avgDurationQuery = await client.query({
      query: "SELECT AVG(Duration) as avg_duration FROM otel_traces",
      format: "JSONEachRow",
    });
    const avgDurationData = await avgDurationQuery.json();
    console.log(`Average span duration: ${avgDurationData[0].avg_duration} ns`);

    console.log("Data streaming validation completed successfully.");
  } catch (error) {
    console.error("Error during data streaming validation:", error);
  } finally {
    await client.close();
  }
}

validateDataStreaming();
