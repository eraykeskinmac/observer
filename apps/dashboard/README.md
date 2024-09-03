# Dashboard

The Dashboard application is a Next.js project that provides a user interface for visualizing telemetry data collected via OpenTelemetry SDKs. It features a service map, service list, and detailed views for specific telemetry data.

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm

### Installation

1. Navigate to the `apps/dashboard` directory:

   ```bash
   cd apps/dashboard
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   Create a `.env` file in the `apps/dashboard` directory and add your ClickHouse credentials:

   ```bash
   CLICKHOUSE_ENDPOINT=your_endpoint_here
   CLICKHOUSE_DATABASE=your_database_here
   CLICKHOUSE_USERNAME=your_username_here
   CLICKHOUSE_PASSWORD=your_password_here
   ```

### Running the Development Server

1. Start the development server:

   ```bash
   pnpm dev
   ```

2. Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

### Building for Production

1. Build the application:

   ```bash
   pnpm build
   ```

2. Start the production server:

   ```bash
   pnpm start
   ```

## Project Structure

- **app**: Contains the main application code.
  - **components**: Reusable React components.
  - **services**: Service-specific pages and components.
  - **styles**: Global styles
- **public**: Static assets.
- **.eslintrc.js**: ESLint configuration.
- **next.config.js**: Next.js configuration.
- **tailwind.config.js**: Tailwind CSS configuration.
- **tsconfig.json**: TypeScript configuration.

## Key Features

- **Service Map**: Visualizes services as nodes and their connections using React Flow.
- **Service List**: Displays a list of services with key metrics.
- **Detailed View**: Shows traces and metrics for each service.
- **AI-powered Assistant**: Uses Vercel AI SDK to provide insights and answer queries about the telemetry data.
