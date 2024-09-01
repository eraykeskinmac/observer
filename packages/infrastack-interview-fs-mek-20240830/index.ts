import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { CompressionAlgorithm } from "@opentelemetry/otlp-exporter-base";

interface RegisterOptions {
  endpoint: string;
  instruments: string[];
  serviceName?: string;
  serviceVersion?: string;
  environment?: string;
  logLevel?: DiagLogLevel;
  compression?: "gzip" | "none";
  exporter?: "otlp";
}

export function register(options: RegisterOptions): void {
  const {
    endpoint,
    instruments,
    serviceName,
    serviceVersion,
    environment,
    logLevel,
    compression,
  } = options;

  diag.setLogger(new DiagConsoleLogger(), logLevel || DiagLogLevel.INFO);

  const traceExporter = new OTLPTraceExporter({
    url: endpoint,
    compression: compression === "gzip" ? CompressionAlgorithm.GZIP : undefined,
  });

  const instrumentations = [
    ...getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-http": {},
      "@opentelemetry/instrumentation-express": {},
    }),
  ];

  const filteredInstrumentations = instrumentations.filter((instr) =>
    instruments.some((i) =>
      instr.instrumentationName.toLowerCase().includes(i.toLowerCase())
    )
  );

  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]:
        serviceName || process.env.SERVICE_NAME || "unknown_service",
      [SemanticResourceAttributes.SERVICE_VERSION]:
        serviceVersion || process.env.SERVICE_VERSION || "0.1.0",
      [SemanticResourceAttributes.SERVICE_INSTANCE_ID]:
        process.env.POD_NAME || `${Date.now()}`,
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]:
        environment || process.env.NODE_ENV || "development",
    }),
    traceExporter,
    instrumentations: filteredInstrumentations,
  });

  sdk.start();

  process.on("SIGTERM", () => {
    sdk
      .shutdown()
      .then(() => diag.info("Tracing terminated"))
      .catch((error) => diag.error("Error terminating tracing", error))
      .finally(() => process.exit(0));
  });
}

export { DiagLogLevel };
