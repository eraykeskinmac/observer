# OpenTelemetry Wrapper

A simple wrapper for OpenTelemetry SDKs to easily integrate telemetry into your Node.js applications.

## Features

- Easy setup for OpenTelemetry
- Support for HTTP, Express, and gRPC instrumentations
- Configurable collector endpoint
- Customizable service name, version, and environment

## Installation

```bash
npm install @eraykeskinmac/infrastack-interview-20240830
```

## Usage

Add this to your application's entry point:

```javascript
import { register } from "@eraykeskinmac/infrastack-interview-20240830";

register({
  endpoint: "localhost:4317",
  instruments: ["http", "express", "grpc"],
  serviceName: "my-service",
  serviceVersion: "1.0.0",
  environment: "production",
});
```

## Configuration

The `register` function accepts the following options:

- `endpoint`: The OpenTelemetry Collector endpoint (default: "localhost:4317")
- `instruments`: Array of instruments to use (options: 'http', 'express', 'grpc')
- `serviceName`: (Optional) Your service name
- `serviceVersion`: (Optional) Your service version
- `environment`: (Optional) Your deployment environment

## Environment Variables

If not provided in the `register` function, the following environment variables will be used:

- `SERVICE_NAME`: Your service name (default: 'unknown_service')
- `SERVICE_VERSION`: Your service version (default: '0.1.0')
- `NODE_ENV`: Your deployment environment (default: 'development')

## Example

```javascript
register({
  endpoint: "collector.example.com:4317",
  instruments: ["http", "express"],
  serviceName: "user-service",
  serviceVersion: "2.3.4",
  environment: "staging",
});
```

## Notes

- If `serviceName`, `serviceVersion`, or `environment` are not provided in the `register` function or as environment variables, default values will be used.
- The `SERVICE_INSTANCE_ID` is automatically generated if not provided through the `POD_NAME` environment variable.

## License

ISC License

---
