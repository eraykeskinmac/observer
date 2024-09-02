# Observer: Distributed Tracing and Monitoring System

Observer is a comprehensive distributed tracing and monitoring system built with Next.js, Express, and OpenTelemetry. It provides real-time insights into your microservices architecture, helping you visualize service dependencies, track performance metrics, and troubleshoot issues efficiently.

## Project Structure

This project is a monorepo managed with Turborepo and pnpm. It consists of the following main components:

- `apps/dashboard`: Next.js frontend application for visualizing tracing data
- `apps/user-service`: Express-based microservice for user management
- `apps/order-service`: Express-based microservice for order management
- `apps/product-service`: Express-based microservice for product management
- `packages/ui`: Shared UI components library
- `packages/infrastack-interview-fs-mek-20240830`: OpenTelemetry SDK wrapper

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/your-username/observer.git
   cd observer
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Set up the OpenTelemetry Collector:
   ```
   cp docker/otel-collector/otel-collector-config.example.yaml docker/otel-collector/otel-collector-config.yaml
   ```
   Edit `docker/otel-collector/otel-collector-config.yaml` and replace placeholder values with your actual ClickHouse credentials.

4. Create a `.env` file in the project root and add your ClickHouse credentials:
   ```
   CLICKHOUSE_ENDPOINT=your_endpoint_here
   CLICKHOUSE_DATABASE=your_database_here
   CLICKHOUSE_USERNAME=your_username_here
   CLICKHOUSE_PASSWORD=your_password_here
   ```

5. Start the development environment:
   ```
   pnpm dev
   ```

6. Open [http://localhost:3001](http://localhost:3001) in your browser to access the Observer dashboard.

## Features

- Real-time service dependency visualization
- Performance metrics and charts
- Trace analysis and filtering
- AI-powered Copilot for assistance and insights

## Documentation

For more detailed information about each component and how to use the Observer system, please refer to the README files in each application directory:

- [Dashboard README](apps/dashboard/README.md)
- [User Service README](apps/user-service/README.md)
- [Order Service README](apps/order-service/README.md)
- [Product Service README](apps/product-service/README.md)
