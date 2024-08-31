const { createClient } = require('@clickhouse/client');
const dotenv = require('dotenv');

dotenv.config({ path: '../../.env' });

const client = createClient({
  host: process.env.CLICKHOUSE_ENDPOINT,
  database: process.env.CLICKHOUSE_DATABASE,
  username: process.env.CLICKHOUSE_USERNAME,
  password: process.env.CLICKHOUSE_PASSWORD
});

async function validateDataStreaming() {
  console.log('Validating data streaming to ClickHouse...');

  try {
    const dataExistsQuery = await client.query({
      query: 'SELECT COUNT(*) as count FROM otel_traces',
      format: 'JSONEachRow'
    });
    const dataExists = await dataExistsQuery.json();
    const count = dataExists[0].count;

    if (count === 0) {
      console.error('No data found in ClickHouse. Make sure your application is sending data.');
      return;
    }

    console.log(`Found ${count} records in ClickHouse.`);

    const recentDataQuery = await client.query({
      query: 'SELECT MAX(Timestamp) as latest FROM otel_traces',
      format: 'JSONEachRow'
    });
    const recentData = await recentDataQuery.json();
    const latestTimestamp = new Date(recentData[0].latest);
    console.log(`Latest data received at ${latestTimestamp}`);

    const spanNamesQuery = await client.query({
      query: 'SELECT DISTINCT SpanName FROM otel_traces LIMIT 10',
      format: 'JSONEachRow'
    });
    const spanNames = await spanNamesQuery.json();
    console.log('Span names found:', spanNames.map(row => row.SpanName).join(', '));

    console.log('Data streaming validation completed successfully.');
  } catch (error) {
    console.error('Error during data streaming validation:', error);
  } finally {
    await client.close();
  }
}

validateDataStreaming();