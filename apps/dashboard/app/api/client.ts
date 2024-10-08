import { createClient } from "@clickhouse/client";

let client: ReturnType<typeof createClient> | null = null;

export function getClient() {
  if (!client) {
    client = createClient({
      url: "https://ing1s0a8r4.eu-west-1.aws.clickhouse.cloud:8443",
      username: "default",
      password: "N81NSgNIW~LRD",
      database: "default",
      request_timeout: 5000,
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
