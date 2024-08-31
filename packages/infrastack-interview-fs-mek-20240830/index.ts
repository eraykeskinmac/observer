import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

interface RegisterOptions {
  endpoint: string;
  instruments: string[];
  serviceName?: string;
  serviceVersion?: string;
  environment?: string;
}

export function register(options: RegisterOptions): void {
  const { endpoint, instruments, serviceName, serviceVersion, environment } =
    options;

  const traceExporter = new OTLPTraceExporter({
    url: endpoint,
  });

  const instrumentations = getNodeAutoInstrumentations({
    "@opentelemetry/instrumentation-http": {},
    "@opentelemetry/instrumentation-express": {},
    "@opentelemetry/instrumentation-mongodb": {},
  });

  const filteredInstrumentations = instrumentations.filter((instr) =>
    instruments.some((i) => instr.instrumentationName.includes(i))
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
      .then(() => console.log("Tracing terminated"))
      .catch((error) => console.log("Error terminating tracing", error))
      .finally(() => process.exit(0));
  });
}
