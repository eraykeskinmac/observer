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
  serviceName: "product-service",
  serviceVersion: "1.0.0",
  environment: "development",
  logLevel: DiagLogLevel.DEBUG,
  metricExportIntervalMillis: 30000,
});

const app = express();
const PORT = process.env.PORT || 4003;

const tracer = getTracer("product-service");
const meter = getMeter("product-service");

// Custom metrics
const productCounter = meter.createCounter("ProductsCreated", {
  description: "Total number of products created",
});

const productProcessingTime = meter.createHistogram("ProductProcessingTime", {
  description: "Time taken to process a product operation",
  unit: "ms",
});

const activeProducts = meter.createUpDownCounter("ActiveProducts", {
  description: "Number of active products",
});

// Simulated database
const products = [];

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

app.get("/products", (req, res) => {
  const startTime = Date.now();
  tracer.startActiveSpan("GetProducts", { kind: SpanKind.SERVER }, (span) => {
    try {
      span.setAttribute("ServiceName", "product-service");
      span.setAttribute("SpanName", "GetProducts");
      span.setAttribute("ProductsCount", products.length);
      res.json(products);
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      res.status(500).json({ error: "Internal server error" });
    } finally {
      const processingTime = Date.now() - startTime;
      productProcessingTime.record(processingTime, {
        Operation: "GetProducts",
      });
      span.end();
    }
  });
});

app.post("/products", (req, res) => {
  const startTime = Date.now();
  tracer.startActiveSpan("CreateProduct", { kind: SpanKind.SERVER }, (span) => {
    try {
      const newProduct = {
        id: products.length + 1,
        ...req.body,
        createdAt: new Date(),
      };
      products.push(newProduct);

      span.setAttribute("ServiceName", "product-service");
      span.setAttribute("SpanName", "CreateProduct");
      span.setAttribute("ProductId", newProduct.id);
      span.setAttribute("ProductName", newProduct.name);
      span.addEvent("ProductCreated", {
        Timestamp: Date.now(),
        Attributes: { ProductId: newProduct.id },
      });

      productCounter.add(1, { ProductType: newProduct.type || "standard" });
      activeProducts.add(1);

      res.status(201).json(newProduct);
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      res.status(500).json({ error: "Internal server error" });
    } finally {
      const processingTime = Date.now() - startTime;
      productProcessingTime.record(processingTime, {
        Operation: "CreateProduct",
      });
      span.end();
    }
  });
});

app.get("/products/:id", (req, res) => {
  const startTime = Date.now();
  tracer.startActiveSpan(
    "GetProductById",
    { kind: SpanKind.SERVER },
    (span) => {
      try {
        const productId = parseInt(req.params.id);
        span.setAttribute("ServiceName", "product-service");
        span.setAttribute("SpanName", "GetProductById");
        span.setAttribute("ProductId", productId);

        const product = products.find((p) => p.id === productId);

        if (product) {
          res.json(product);
        } else {
          span.setStatus({ code: SpanStatusCode.ERROR });
          res.status(404).json({ error: "Product not found" });
        }
      } catch (error) {
        span.recordException(error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        res.status(500).json({ error: "Internal server error" });
      } finally {
        const processingTime = Date.now() - startTime;
        productProcessingTime.record(processingTime, {
          Operation: "GetProductById",
        });
        span.end();
      }
    }
  );
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

const server = app.listen(PORT, () => {
  console.log(`Product service listening on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});
