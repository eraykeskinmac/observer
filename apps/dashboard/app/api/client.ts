import { createClient } from "@clickhouse/client";

const client = createClient({
  url: process.env.CLICKHOUSE_HOST,
  username: process.env.CLICKHOUSE_USERNAME || "default",
  password: process.env.CLICKHOUSE_PASSWORD || "",
  database: process.env.CLICKHOUSE_DATABASE || "",
});

async function testConnection() {
  try {
    const rows = await client.query({
      query: "SELECT 1",
      format: "JSONEachRow",
    });

    console.log("Connection successful:", await rows.json());
  } catch (error) {
    console.error("Error connecting to ClickHouse:", error);
  }
}

testConnection();

export default client;
