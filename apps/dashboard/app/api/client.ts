import { createClient } from "@clickhouse/client";

let client: ReturnType<typeof createClient> | null = null;

export function getClient() {
  if (!client) {
    client = createClient({
      url: process.env.CLICKHOUSE_HOST,
      username: process.env.CLICKHOUSE_USERNAME || "default",
      password: process.env.CLICKHOUSE_PASSWORD || "",
      database: process.env.CLICKHOUSE_DATABASE || "",
    });
  }
  return client;
}

export async function testConnection() {
  try {
    const client = getClient();
    const rows = await client.query({
      query: "SELECT 1",
      format: "JSONEachRow",
    });
    console.log("Connection successful:", await rows.json());
  } catch (error) {
    console.error("Error connecting to ClickHouse:", error);
    throw error;
  }
}