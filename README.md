# Observer

Observer is a telemetry data visualization application built using Next.js, OpenTelemetry, and ClickHouse. The application features a service map, service list, and detailed views for specific telemetry data.

## Project Overview

This project is structured as a Turborepo application with multiple services and packages. The main components include:

- **Dashboard**: A Next.js application for visualizing telemetry data.
- **Order Service**: An Express.js microservice.
- **Product Service**: An Express.js microservice.
- **User Service**: An Express.js microservice.
- **UI**: Shared UI components and styles.
- **ESLint Config**: Shared ESLint configurations.
- **TypeScript Config**: Shared TypeScript configurations.
- **Infrastack Interview FS MEK 20240830**: A wrapper for OpenTelemetry SDKs.

## Getting Started

### Prerequisites

- Node.js >= 18
- Docker
- Docker Compose
- pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/observer.git
   cd observer
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add your ClickHouse credentials:

   ```bash
   CLICKHOUSE_ENDPOINT=your_endpoint_here
   CLICKHOUSE_DATABASE=your_database_here
   CLICKHOUSE_USERNAME=your_username_here
   CLICKHOUSE_PASSWORD=your_password_here
   ```

4. Set up the OpenTelemetry Collector:

   ```bash
   cp docker/otel-collector/otel-collector-config.example.yaml docker/otel-collector/otel-collector-config.yaml
   ```

5. Start the services:

   ```bash
   pnpm start:all
   ```

### Running the Dashboard

1. Navigate to the `apps/dashboard` directory:

   ```bash
   cd apps/dashboard
   ```

2. Start the development server:

   ```bash
   pnpm dev
   ```

3. Open [http://localhost:3001](http://localhost:3001) in your browser.

### Running the Microservices

1. Navigate to the root directory of the project:

   ```bash
   cd ../../
   ```

2. Start the services using Docker Compose:

   ```bash
   docker-compose up -d
   ```

The services will be available at the following URLs:

- Order Service: [http://localhost:4002](http://localhost:4002)
- Product Service: [http://localhost:4003](http://localhost:4003)
- User Service: [http://localhost:4001](http://localhost:4001)

## Project Structure

- **apps**: Contains the main applications.
  - [Dashboard](#dashboard)
  - [Order Service](#order-service)
  - [Product Service](#product-service)
  - [User Service](#user-service)
- **packages**: Contains shared packages and configurations.
  - [UI](#ui)
  - [ESLint Config](#eslint-config)
  - [TypeScript Config](#typescript-config)
  - [Infrastack Interview FS MEK 20240830](#infrastack-interview-fs-mek-20240830)
- **docker**: Contains Docker-related configurations.
  - [OpenTelemetry Collector](#opentelemetry-collector)
- **tools**: Contains utility scripts and tools.

## Applications

### Dashboard

The Dashboard application is a Next.js project that provides a user interface for monitoring and managing services.

- **Getting Started**: Refer to the [Dashboard README](apps/dashboard/README.md) for setup instructions.
- **Development**: Run the development server using `pnpm dev`.
- **Deployment**: Follow the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for deployment details.

### Order Service

The Order Service is an Express.js application that handles order-related operations.

- **Getting Started**: Refer to the [Order Service README](apps/order-service/README.md) for setup instructions.
- **Development**: Run the development server using `pnpm dev`.
- **Docker**: The service can be run using Docker. Refer to the [Dockerfile](apps/order-service/Dockerfile) for details.

### Product Service

The Product Service is an Express.js application that handles product-related operations.

- **Getting Started**: Refer to the [Product Service README](apps/product-service/README.md) for setup instructions.
- **Development**: Run the development server using `pnpm dev`.
- **Docker**: The service can be run using Docker. Refer to the [Dockerfile](apps/product-service/Dockerfile) for details.

### User Service

The User Service is an Express.js application that handles user-related operations.

- **Getting Started**: Refer to the [User Service README](apps/user-service/README.md) for setup instructions.
- **Development**: Run the development server using `pnpm dev`.
- **Docker**: The service can be run using Docker. Refer to the [Dockerfile](apps/user-service/Dockerfile) for details.

## Packages

### UI

The UI package contains shared UI components and styles.

- **Getting Started**: Refer to the [UI README](packages/ui/README.md) for setup instructions.
- **Development**: Run the development server using `pnpm dev`.

### ESLint Config

The ESLint Config package contains shared ESLint configurations.

- **Getting Started**: Refer to the [ESLint Config README](packages/eslint-config/README.md) for setup instructions.

### TypeScript Config

The TypeScript Config package contains shared TypeScript configurations.

- **Getting Started**: Refer to the [TypeScript Config README](packages/typescript-config/README.md) for setup instructions.

### Infrastack Interview FS MEK 20240830

The Infrastack Interview FS MEK 20240830 package is a wrapper for the OpenTelemetry SDK.

- **Getting Started**: Refer to the [Infrastack Interview FS MEK 20240830 README](packages/infrastack-interview-fs-mek-20240830/README.md) for setup instructions.

## Docker

### OpenTelemetry Collector

The OpenTelemetry Collector is configured to collect and export telemetry data.

- **Getting Started**: Refer to the [OpenTelemetry Collector README](docker/otel-collector/README.md) for setup instructions.
- **Configuration**: The collector configuration can be found in the [otel-collector-config.yaml](docker/otel-collector/otel-collector-config.yaml) file.

## Tools

The tools directory contains utility scripts and tools for the project.

- **Validation Scripts**: Contains scripts for data validation and other utilities.
