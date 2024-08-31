const { createClient } = require('@clickhouse/client');
const dotenv = require('dotenv');

dotenv.config({ path: '../../../.env' });

const client = createClient({
  host: process.env.CLICKHOUSE_ENDPOINT,
  database: process.env.CLICKHOUSE_DATABASE,
  username: process.env.CLICKHOUSE_USERNAME,
  password: process.env.CLICKHOUSE_PASSWORD
});

async function validateDataStreaming() {
  console.log('Validating data streaming to ClickHouse...');

  try {
    const countQuery = await client.query({
      query: 'SELECT COUNT(*) as count FROM default.otel_traces',
      format: 'JSONEachRow'
    });
    const countData = await countQuery.json();
    console.log(`Found ${countData[0].count} records in ClickHouse.`);

    const latestDataQuery = await client.query({
      query: 'SELECT MAX(Timestamp) as latest FROM default.otel_traces',
      format: 'JSONEachRow'
    });
    const latestData = await latestDataQuery.json();
    console.log(`Latest data received at ${new Date(latestData[0].latest).toLocaleString()}`);

    const spanNamesQuery = await client.query({
      query: 'SELECT DISTINCT SpanName FROM default.otel_traces LIMIT 10',
      format: 'JSONEachRow'
    });
    const spanNames = await spanNamesQuery.json();
    console.log('Span names found:', spanNames.map(row => row.SpanName).join(', '));

    const largePayloadQuery = await client.query({
      query: 'SELECT COUNT(*) as count FROM default.otel_traces WHERE length(SpanAttributes) > 10',
      format: 'JSONEachRow'
    });
    const largePayloadData = await largePayloadQuery.json();
    console.log(`Number of spans with large payloads: ${largePayloadData[0].count}`);

    const sdkLanguageQuery = await client.query({
      query: 'SELECT DISTINCT ResourceAttributes[\'telemetry.sdk.language\'] as sdk_language FROM default.otel_traces WHERE ResourceAttributes[\'telemetry.sdk.language\'] IS NOT NULL LIMIT 1',
      format: 'JSONEachRow'
    });
    const sdkLanguageData = await sdkLanguageQuery.json();
    console.log(`SDK Language: ${sdkLanguageData[0]?.sdk_language || 'Not found'}`);

    const exporterQuery = await client.query({
      query: 'SELECT DISTINCT ResourceAttributes[\'telemetry.sdk.name\'] as sdk_name FROM default.otel_traces WHERE ResourceAttributes[\'telemetry.sdk.name\'] IS NOT NULL LIMIT 1',
      format: 'JSONEachRow'
    });
    const exporterData = await exporterQuery.json();
    console.log(`Exporter SDK: ${exporterData[0]?.sdk_name || 'Not found'}`);

    const avgDurationQuery = await client.query({
      query: 'SELECT AVG(Duration) as avg_duration FROM default.otel_traces',
      format: 'JSONEachRow'
    });
    const avgDurationData = await avgDurationQuery.json();
    console.log(`Average span duration: ${avgDurationData[0].avg_duration} ns`);

    console.log('Data streaming validation completed successfully.');
  } catch (error) {
    console.error('Error during data streaming validation:', error);
  } finally {
    await client.close();
  }
}

validateDataStreaming();