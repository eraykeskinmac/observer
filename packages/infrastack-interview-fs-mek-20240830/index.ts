import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import {
  diag,
  DiagConsoleLogger,
  DiagLogLevel,
  metrics,
  trace,
  context,
  propagation,
} from "@opentelemetry/api";
import { W3CTraceContextPropagator } from "@opentelemetry/core";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";

interface RegisterOptions {
  endpoint: string;
  instruments: string[];
  serviceName: string;
  serviceVersion: string;
  environment: string;
  logLevel?: DiagLogLevel;
  metricExportIntervalMillis?: number;
}

export function register(options: RegisterOptions): void {
  const {
    endpoint,
    instruments,
    serviceName,
    serviceVersion,
    environment,
    logLevel = DiagLogLevel.INFO,
    metricExportIntervalMillis = 30000,
  } = options;

  diag.setLogger(new DiagConsoleLogger(), logLevel);

  const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    [SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion,
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
  });

  const traceExporter = new OTLPTraceExporter({
    url: `${endpoint}/v1/traces`,
  });

  const metricExporter = new OTLPMetricExporter({
    url: `${endpoint}/v1/metrics`,
  });

  const sdk = new NodeSDK({
    resource: resource,
    traceExporter: traceExporter,
    metricReader: new PeriodicExportingMetricReader({
      exporter: metricExporter,
      exportIntervalMillis: metricExportIntervalMillis,
    }),
    instrumentations: [
      getNodeAutoInstrumentations({
        "@opentelemetry/instrumentation-http": {
          enabled: instruments.includes("http"),
        },
        "@opentelemetry/instrumentation-express": {
          enabled: instruments.includes("express"),
        },
        "@opentelemetry/instrumentation-mongodb": {
          enabled: instruments.includes("mongodb"),
        },
      }),
    ],
    textMapPropagator: new W3CTraceContextPropagator(),
  });

  sdk.start();

  process.on("SIGTERM", () => {
    sdk
      .shutdown()
      .then(() => console.log("SDK shut down successfully"))
      .catch((error) => console.log("Error shutting down SDK", error))
      .finally(() => process.exit(0));
  });
}

export function getTracer(name: string) {
  return trace.getTracer(name);
}

export function getMeter(name: string) {
  return metrics.getMeter(name);
}

export function extractContext(headers: Record<string, string>) {
  return propagation.extract(context.active(), headers);
}

export function injectContext(metadata: Record<string, string>) {
  return propagation.inject(context.active(), metadata);
}

export { context, DiagLogLevel };
