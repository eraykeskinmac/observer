import { createClient } from "@clickhouse/client";

console.log('ClickHouse Environment Variables:', {
  CLICKHOUSE_HOST: process.env.CLICKHOUSE_HOST,
  CLICKHOUSE_USERNAME: process.env.CLICKHOUSE_USERNAME,
  CLICKHOUSE_DATABASE: process.env.CLICKHOUSE_DATABASE,
});

if (!process.env.CLICKHOUSE_HOST) {
  throw new Error('CLICKHOUSE_HOST is not defined');
}

const client = createClient({
  url: process.env.CLICKHOUSE_HOST,
  username: process.env.CLICKHOUSE_USERNAME || '',
  password: process.env.CLICKHOUSE_PASSWORD || '',
  database: process.env.CLICKHOUSE_DATABASE || '',
});

export default client;