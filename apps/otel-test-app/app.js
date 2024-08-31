const express = require('express');
const sdk = require('@eraykeskinmac/infrastack-interview-20240830');
const { trace } = require('@opentelemetry/api');

console.log('SDK exports:', Object.keys(sdk));

const { register } = sdk;

register({
  endpoint: "http://localhost:4317",
  instruments: ['http', 'express'],
  serviceName: "test-otel-app",
  serviceVersion: "1.0.0",
  environment: "development"
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