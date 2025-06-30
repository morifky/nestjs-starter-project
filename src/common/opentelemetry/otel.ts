import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { configService } from '@/config/config';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { TypeormInstrumentation } from '@opentelemetry/instrumentation-typeorm';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';

const metricExporter = new OTLPMetricExporter({
  url: `${configService.getOTLPEndpoint()}/v1/metrics`,
});

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 1000,
});

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: `${configService.getOTLPEndpoint()}/v1/traces`,
  }),
  serviceName: configService.getServiceName(),
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
