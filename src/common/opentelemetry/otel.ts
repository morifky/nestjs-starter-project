import 'dotenv/config';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { TypeormInstrumentation } from '@opentelemetry/instrumentation-typeorm';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';

const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
const serviceName = process.env.SERVICE_NAME;

const metricExporter = new OTLPMetricExporter({
  url: `${otlpEndpoint}/v1/metrics`,
});

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 1000,
});

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: `${otlpEndpoint}/v1/traces`,
  }),
  serviceName,
  metricReader,
  instrumentations: [
    new NestInstrumentation(),
    new TypeormInstrumentation(),
    new PgInstrumentation(),
  ],
  autoDetectResources: true,
});

sdk.start();
console.log('OpenTelemetry tracing and metrics initialized');
