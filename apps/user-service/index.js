const express = require("express");
const {
  register,
  getTracer,
  getMeter,
  extractContext,
  injectContext,
  context,
  DiagLogLevel,
} = require("@eraykeskinmac/infrastack-interview-20240830");
const { SpanStatusCode, SpanKind } = require("@opentelemetry/api");

register({
  endpoint: "http://otel-collector:4317",
  instruments: ["http", "express"],
  serviceName: "user-service",
  serviceVersion: "1.0.0",
  environment: "development",
  logLevel: DiagLogLevel.DEBUG,
  metricExportIntervalMillis: 30000,
});

const app = express();
const PORT = process.env.PORT || 4001;

const tracer = getTracer("user-service");
const meter = getMeter("user-service");

// Custom metrics
const userCounter = meter.createCounter("UsersCreated", {
  description: "Total number of users created",
});

const userProcessingTime = meter.createHistogram("UserProcessingTime", {
  description: "Time taken to process a user operation",
  unit: "ms",
});

const activeUsers = meter.createUpDownCounter("ActiveUsers", {
  description: "Number of active users",
});

// Simulated database
const users = [];

app.use(express.json());

// Middleware to extract trace context
app.use((req, res, next) => {
  const parentContext = extractContext(req.headers);
  return context.with(parentContext, () => {
    const responseHeaders = {};
    injectContext(responseHeaders);
    res.set(responseHeaders);
    next();
  });
});

app.get("/users", (req, res) => {
  const startTime = Date.now();
  tracer.startActiveSpan("GetUsers", { kind: SpanKind.SERVER }, (span) => {
    try {
      span.setAttribute("ServiceName", "user-service");
      span.setAttribute("SpanName", "GetUsers");
      span.setAttribute("UsersCount", users.length);
      res.json(users);
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      res.status(500).json({ error: "Internal server error" });
    } finally {
      const processingTime = Date.now() - startTime;
      userProcessingTime.record(processingTime, { Operation: "GetUsers" });
      span.end();
    }
  });
});

app.post("/users", (req, res) => {
  const startTime = Date.now();
  tracer.startActiveSpan("CreateUser", { kind: SpanKind.SERVER }, (span) => {
    try {
      const newUser = {
        id: users.length + 1,
        ...req.body,
        createdAt: new Date(),
      };
      users.push(newUser);

      span.setAttribute("ServiceName", "user-service");
      span.setAttribute("SpanName", "CreateUser");
      span.setAttribute("UserId", newUser.id);
      span.setAttribute("UserEmail", newUser.email);
      span.addEvent("UserCreated", {
        Timestamp: Date.now(),
        Attributes: { UserId: newUser.id },
      });

      userCounter.add(1, { UserType: newUser.type || "standard" });
      activeUsers.add(1);

      res.status(201).json(newUser);
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      res.status(500).json({ error: "Internal server error" });
    } finally {
      const processingTime = Date.now() - startTime;
      userProcessingTime.record(processingTime, { Operation: "CreateUser" });
      span.end();
    }
  });
});

app.get("/users/:id", (req, res) => {
  const startTime = Date.now();
  tracer.startActiveSpan("GetUserById", { kind: SpanKind.SERVER }, (span) => {
    try {
      const userId = parseInt(req.params.id);
      span.setAttribute("ServiceName", "user-service");
      span.setAttribute("SpanName", "GetUserById");
      span.setAttribute("UserId", userId);

      const user = users.find((u) => u.id === userId);

      if (user) {
        res.json(user);
      } else {
        span.setStatus({ code: SpanStatusCode.ERROR });
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      res.status(500).json({ error: "Internal server error" });
    } finally {
      const processingTime = Date.now() - startTime;
      userProcessingTime.record(processingTime, { Operation: "GetUserById" });
      span.end();
    }
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

const server = app.listen(PORT, () => {
  console.log(`User service listening on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});
