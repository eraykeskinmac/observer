# OpenTelemetry Wrapper

A simple wrapper for OpenTelemetry SDKs to easily integrate telemetry into your Node.js applications.

## Features

- Easy setup for OpenTelemetry
- Support for HTTP, Express
- Configurable collector endpoint
- Customizable service name, version, and environment
- Configurable log levels
- Optional gzip compression
- Flexible exporter options

## Installation

```bash
npm install @eraykeskinmac/infrastack-interview-20240830
```

## Usage

Add this to your application's entry point:

```javascript
import {
  register,
  DiagLogLevel,
} from "@eraykeskinmac/infrastack-interview-20240830";

register({
  endpoint: "http://localhost:4317",
  instruments: ["http", "express", "mongodb"],
  serviceName: "my-service",
  serviceVersion: "1.0.0",
  environment: "production",
  logLevel: DiagLogLevel.INFO,
  compression: "gzip",
  exporter: "otlp",
});
```

## Configuration

The `register` function accepts the following options:

- `endpoint`: The OpenTelemetry Collector endpoint (required)
- `instruments`: Array of instruments to use (options: 'http', 'express', 'mongodb') (required)
- `serviceName`: (Optional) Your service name
- `serviceVersion`: (Optional) Your service version
- `environment`: (Optional) Your deployment environment
- `logLevel`: (Optional) Log level for diagnostics (default: DiagLogLevel.INFO)
- `compression`: (Optional) Compression algorithm ('gzip' or 'none')
- `exporter`: (Optional) Exporter type (currently only 'otlp' is supported)

## Environment Variables

If not provided in the `register` function, the following environment variables will be used:

- `SERVICE_NAME`: Your service name (default: 'unknown_service')
- `SERVICE_VERSION`: Your service version (default: '0.1.0')
- `NODE_ENV`: Your deployment environment (default: 'development')
- `POD_NAME`: Used for SERVICE_INSTANCE_ID in Kubernetes environments

## License

ISC License

---
