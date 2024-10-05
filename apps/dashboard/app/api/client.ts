import { createClient } from "@clickhouse/client";

const client = createClient({
  url: "https://ing1s0a8r4.eu-west-1.aws.clickhouse.cloud:8443",
  username: "default",
  password: "N81NSgNIW~LRD",
  database: "default",
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
