Observer

## OpenTelemetry Collector Configuration

To set up the OpenTelemetry Collector:

1. Copy the example configuration file:

   ```
   cp docker/otel-collector/otel-collector-config.example.yaml docker/otel-collector/otel-collector-config.yaml
   ```

2. Edit `docker/otel-collector/otel-collector-config.yaml` and replace the placeholder values with your actual ClickHouse credentials.

3. Create a `.env` file in the Turborepo root and add your ClickHouse credentials:

   ```
   CLICKHOUSE_ENDPOINT=your_endpoint_here
   CLICKHOUSE_DATABASE=your_database_here
   CLICKHOUSE_USERNAME=your_username_here
   CLICKHOUSE_PASSWORD=your_password_here
   ```

4. Make sure not to commit `otel-collector-config.yaml` or `.env` to version control.

Note: The `otel-collector-config.yaml` file is gitignored to protect sensitive information.
