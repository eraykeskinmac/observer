# OpenTelemetry Wrapper

A simple wrapper for OpenTelemetry SDKs to easily integrate telemetry into your Node.js applications.

## Features

- Easy setup for OpenTelemetry
- Support for HTTP, Express, and gRPC instrumentations
- Configurable collector endpoint

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
});
```

## Configuration

The `register` function accepts the following options:

- `endpoint`: The OpenTelemetry Collector endpoint (default: "localhost:4317")
- `instruments`: Array of instruments to use (options: 'http', 'express', 'grpc')

## Environment Variables

- `SERVICE_NAME`: Your service name (default: 'unknown_service')
- `SERVICE_VERSION`: Your service version (default: '0.1.0')

## Example

```javascript
register({
  endpoint: "collector.example.com:4317",
  instruments: ["http", "express"],
});
```

## License

ISC License

---
