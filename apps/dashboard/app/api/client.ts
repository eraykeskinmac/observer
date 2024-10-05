import { createClient } from "@clickhouse/client";

const client = createClient({
  host: process.env.CLICKHOUSE_HOST,
  username: process.env.CLICKHOUSE_USERNAME || '',
  password: process.env.CLICKHOUSE_PASSWORD || '',
  database: process.env.CLICKHOUSE_DATABASE || '',
  tls: {
    rejectUnauthorized: false // Not recommended for production
  } as any
});

export default client;