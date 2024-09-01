const express = require("express");
const {
  register,
  DiagLogLevel,
} = require("@eraykeskinmac/infrastack-interview-20240830");
const {
  trace,
  SpanStatusCode,
  context,
  SpanKind,
} = require("@opentelemetry/api");

register({
  endpoint: "http://localhost:4317",
  instruments: ["http", "express"],
  serviceName: "product-service",
  serviceVersion: "1.0.0",
  environment: "development",
  logLevel: DiagLogLevel.DEBUG,
  compression: "gzip",
  exporter: "otlp",
});

const app = express();
const PORT = process.env.PORT || 4003;

const tracer = trace.getTracer("product-service");

app.get("/products", (req, res) => {
  const span = tracer.startSpan("get-products");
  span.setAttribute("custom.attribute", "test-value");

  setTimeout(() => {
    span.setStatus({ code: SpanStatusCode.OK });
    span.end();
    res.json({ message: "List of products" });
  }, 100);
});

app.post("/products", (req, res) => {
  const span = tracer.startSpan("create-product");
  span.setAttribute("custom.attribute", "test-value");

  setTimeout(() => {
    span.setStatus({ code: SpanStatusCode.OK });
    span.end();
    res.json({ message: "Product created" });
  }, 100);
});

app.get("/products/:id", (req, res) => {
  const span = tracer.startSpan("get-product-by-id");
  span.setAttribute("product.id", req.params.id);

  setTimeout(() => {
    span.setStatus({ code: SpanStatusCode.OK });
    span.end();
    res.json({ message: `Product with id ${req.params.id}` });
  }, 100);
});

app.listen(PORT, () => {
  console.log(`Product service listening on port ${PORT}`);
});
