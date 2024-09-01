const express = require("express");
const {
  register,
  DiagLogLevel,
} = require("@eraykeskinmac/infrastack-interview-20240830");
const { trace, SpanStatusCode } = require("@opentelemetry/api");

register({
  endpoint: "http://localhost:4317",
  instruments: ["http", "express"],
  serviceName: "order-service",
  serviceVersion: "1.0.0",
  environment: "development",
  logLevel: DiagLogLevel.DEBUG,
  compression: "gzip",
  exporter: "otlp",
});

const app = express();
const PORT = process.env.PORT || 4002;

const tracer = trace.getTracer("order-service");

app.get("/orders", (req, res) => {
  const span = tracer.startSpan("get-orders");
  span.setAttribute("custom.attribute", "test-value");

  setTimeout(() => {
    span.setStatus({ code: SpanStatusCode.OK });
    span.end();
    res.json({ message: "List of orders" });
  }, 100);
});

app.post("/orders", (req, res) => {
  const span = tracer.startSpan("create-order");
  span.setAttribute("custom.attribute", "test-value");

  setTimeout(() => {
    span.setStatus({ code: SpanStatusCode.OK });
    span.end();
    res.json({ message: "Order created" });
  }, 100);
});

app.get("/orders/:id", (req, res) => {
  const span = tracer.startSpan("get-order-by-id");
  span.setAttribute("order.id", req.params.id);

  setTimeout(() => {
    span.setStatus({ code: SpanStatusCode.OK });
    span.end();
    res.json({ message: `Order with id ${req.params.id}` });
  }, 100);
});

app.listen(PORT, () => {
  console.log(`Order service listening on port ${PORT}`);
});
