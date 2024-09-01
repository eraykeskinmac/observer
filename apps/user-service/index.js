const express = require("express");
const {
  register,
  DiagLogLevel,
} = require("@eraykeskinmac/infrastack-interview-20240830");
const { trace, SpanStatusCode } = require("@opentelemetry/api");

register({
  endpoint: "http://localhost:4317",
  instruments: ["http", "express"],
  serviceName: "user-service",
  serviceVersion: "1.0.0",
  environment: "development",
  logLevel: DiagLogLevel.DEBUG,
  compression: "gzip",
  exporter: "otlp",
});

const app = express();
const PORT = process.env.PORT || 4001;

const tracer = trace.getTracer("user-service");

app.get("/users", (req, res) => {
  const span = tracer.startSpan("get-users");
  span.setAttribute("custom.attribute", "test-value");

  setTimeout(() => {
    span.setStatus({ code: SpanStatusCode.OK });
    span.end();
    res.json({ message: "List of users" });
  }, 100);
});

app.post("/users", (req, res) => {
  const span = tracer.startSpan("create-user");
  span.setAttribute("custom.attribute", "test-value");

  setTimeout(() => {
    span.setStatus({ code: SpanStatusCode.OK });
    span.end();
    res.json({ message: "User created" });
  }, 100);
});

app.get("/users/:id", (req, res) => {
  const span = tracer.startSpan("get-user-by-id");
  span.setAttribute("user.id", req.params.id);

  setTimeout(() => {
    span.setStatus({ code: SpanStatusCode.OK });
    span.end();
    res.json({ message: `User with id ${req.params.id}` });
  }, 100);
});

app.listen(PORT, () => {
  console.log(`User service listening on port ${PORT}`);
});
