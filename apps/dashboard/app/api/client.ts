import { createClient } from "@clickhouse/client";

const host = process.env.CLICKHOUSE_HOST || '';
const username = process.env.CLICKHOUSE_USERNAME || '';
const password = process.env.CLICKHOUSE_PASSWORD || '';
const database = process.env.CLICKHOUSE_DATABASE || '';

console.log('ClickHouse Connection Info:', { host, username, database });

if (!host) {
  throw new Error('CLICKHOUSE_HOST is not defined');
}

const url = new URL(host);
url.username = username;
url.password = password;
if (database) {
  url.pathname = `/${database}`;
}

const client = createClient({
  url: url.toString(),
});

export default client;