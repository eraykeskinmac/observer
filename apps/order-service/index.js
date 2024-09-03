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
const { SpanStatusCode } = require("@opentelemetry/api");

register({
  endpoint: "http://otel-collector:4317",
  instruments: ["http", "express", "mongodb"],
  serviceName: "order-service",
  serviceVersion: "1.0.0",
  environment: "development",
  logLevel: DiagLogLevel.DEBUG,
  metricExportIntervalMillis: 30000,
});

const app = express();
const PORT = process.env.PORT || 4002;

const tracer = getTracer("order-service");
const meter = getMeter("order-service");

const orderCounter = meter.createCounter("OrdersCreated", {
  description: "Total number of orders created",
});

const orderProcessingTime = meter.createHistogram("OrderProcessingTime", {
  description: "Time taken to process an order",
  unit: "ms",
});

const activeOrders = meter.createUpDownCounter("ActiveOrders", {
  description: "Number of active orders",
});

const orders = [];

app.use(express.json());

app.use((req, res, next) => {
  const parentContext = extractContext(req.headers);
  return context.with(parentContext, () => {
    const responseHeaders = {};
    injectContext(responseHeaders);
    res.set(responseHeaders);
    next();
  });
});

app.get("/orders", (req, res) => {
  tracer.startActiveSpan("GetOrders", (span) => {
    try {
      span.setAttribute("ServiceName", "order-service");
      span.setAttribute("SpanName", "GetOrders");
      span.setAttribute("OrdersCount", orders.length);
      res.json(orders);
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      res.status(500).json({ error: "Internal server error" });
    } finally {
      span.end();
    }
  });
});

app.post("/orders", (req, res) => {
  const startTime = Date.now();

  tracer.startActiveSpan("CreateOrder", (span) => {
    try {
      const newOrder = {
        id: orders.length + 1,
        ...req.body,
        status: "active",
        createdAt: new Date(),
      };
      orders.push(newOrder);

      span.setAttribute("ServiceName", "order-service");
      span.setAttribute("SpanName", "CreateOrder");
      span.setAttribute("OrderId", newOrder.id);
      span.setAttribute("OrderValue", newOrder.value || 0);
      span.addEvent("OrderCreated", {
        Timestamp: Date.now(),
        Attributes: { OrderId: newOrder.id },
      });

      orderCounter.add(1, { OrderType: newOrder.type || "standard" });
      activeOrders.add(1);

      res.status(201).json(newOrder);
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      res.status(500).json({ error: "Internal server error" });
    } finally {
      const processingTime = Date.now() - startTime;
      orderProcessingTime.record(processingTime);
      span.end();
    }
  });
});

app.get("/orders/:id", (req, res) => {
  tracer.startActiveSpan("GetOrderById", (span) => {
    try {
      const orderId = parseInt(req.params.id);
      span.setAttribute("ServiceName", "order-service");
      span.setAttribute("SpanName", "GetOrderById");
      span.setAttribute("OrderId", orderId);

      const order = orders.find((o) => o.id === orderId);

      if (order) {
        res.json(order);
      } else {
        span.setStatus({ code: SpanStatusCode.ERROR });
        res.status(404).json({ error: "Order not found" });
      }
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      res.status(500).json({ error: "Internal server error" });
    } finally {
      span.end();
    }
  });
});

app.put("/orders/:id/complete", (req, res) => {
  tracer.startActiveSpan("CompleteOrder", (span) => {
    try {
      const orderId = parseInt(req.params.id);
      span.setAttribute("ServiceName", "order-service");
      span.setAttribute("SpanName", "CompleteOrder");
      span.setAttribute("OrderId", orderId);

      const order = orders.find((o) => o.id === orderId);

      if (order) {
        order.status = "completed";
        order.completedAt = new Date();
        span.addEvent("OrderCompleted", {
          Timestamp: Date.now(),
          Attributes: { OrderId: order.id },
        });
        activeOrders.add(-1);
        res.json(order);
      } else {
        span.setStatus({ code: SpanStatusCode.ERROR });
        res.status(404).json({ error: "Order not found" });
      }
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      res.status(500).json({ error: "Internal server error" });
    } finally {
      span.end();
    }
  });
});

app.get("/check-inventory", (req, res) => {
  tracer.startActiveSpan("CheckInventory", async (span) => {
    try {
      span.setAttribute("ServiceName", "order-service");
      span.setAttribute("SpanName", "CheckInventory");
      span.setAttribute("ExternalService", "inventory-service");

      await new Promise((resolve) => setTimeout(resolve, 200));

      const inStock = Math.random() > 0.2;
      span.setAttribute("InventoryInStock", inStock);

      if (Math.random() < 0.1) {
        throw new Error("Inventory service temporarily unavailable");
      }

      res.json({ inStock });
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      res.status(500).json({ error: error.message });
    } finally {
      span.end();
    }
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

const server = app.listen(PORT, () => {
  console.log(`Order service listening on port ${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});
