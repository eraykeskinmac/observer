const express = require('express');
const { register, DiagLogLevel } = require('@eraykeskinmac/infrastack-interview-20240830');
const { trace } = require('@opentelemetry/api');

console.log('SDK exports:', Object.keys(require('@eraykeskinmac/infrastack-interview-20240830')));

register({
  endpoint: "http://localhost:4317",
  instruments: ['http', 'express'],
  serviceName: "test-otel-app",
  serviceVersion: "1.0.0",
  environment: "development",
  logLevel: DiagLogLevel.DEBUG,
  compression: "gzip",
  exporter: "otlp"
});

console.log('OpenTelemetry SDK initialized');

const tracer = trace.getTracer('example-tracer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const span = tracer.startSpan('root-endpoint');
  span.setAttribute('custom.attribute', 'test-value');

  setTimeout(() => {
    span.end();
    res.json({ message: 'Hello, OpenTelemetry!' });
  }, 100);
});

app.get('/error', (req, res, next) => {
  const span = tracer.startSpan('error-endpoint');
  span.setAttribute('error', true);

  setTimeout(() => {
    span.end();
    next(new Error('This is a test error'));
  }, 50);
});

app.get('/large-payload', (req, res) => {
  const span = tracer.startSpan('large-payload-endpoint');
  const largeData = Buffer.alloc(1024 * 1024, 'a').toString();
  span.setAttribute('payload.size', largeData.length);
  span.end();
  res.json({ message: 'Large payload processed', size: largeData.length });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

setInterval(() => {
  const span = tracer.startSpan('test-span');
  span.setAttribute('test.attribute', 'test-value');
  setTimeout(() => {
    span.end();
  }, Math.random() * 100);
}, 1000);