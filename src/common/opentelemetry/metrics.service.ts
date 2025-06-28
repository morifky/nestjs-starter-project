import { Injectable } from '@nestjs/common';
import {
  metrics,
  Counter,
  Histogram,
  ObservableGauge,
} from '@opentelemetry/api';

@Injectable()
export class MetricsService {
  private readonly httpRequestsTotal: Counter;
  private readonly httpRequestDuration: Histogram;
  private readonly activeConnections: ObservableGauge;
  private readonly memoryUsage: ObservableGauge;

  constructor() {
    const meter = metrics.getMeter('nestjs-app');

    // HTTP request counter
    this.httpRequestsTotal = meter.createCounter('http_requests_total', {
      description: 'Total number of HTTP requests',
    });

    // HTTP request duration histogram
    this.httpRequestDuration = meter.createHistogram(
      'http_request_duration_seconds',
      {
        description: 'HTTP request duration in seconds',
        unit: 's',
      },
    );

    // Active connections gauge
    this.activeConnections = meter.createObservableGauge('active_connections', {
      description: 'Number of active connections',
    });

    // Memory usage gauge
    this.memoryUsage = meter.createObservableGauge('memory_usage_bytes', {
      description: 'Memory usage in bytes',
      unit: 'bytes',
    });

    // Register observable callbacks
    this.activeConnections.addCallback((result) => {
      // For now, we'll set a default value
      // In a real app, you might track actual connections
      result.observe(0, {});
    });

    this.memoryUsage.addCallback((result) => {
      const memUsage = process.memoryUsage();
      result.observe(memUsage.rss, { type: 'rss' });
      result.observe(memUsage.heapUsed, { type: 'heap_used' });
      result.observe(memUsage.heapTotal, { type: 'heap_total' });
      result.observe(memUsage.external, { type: 'external' });
    });
  }

  incrementHttpRequests(method: string, route: string, statusCode: number) {
    this.httpRequestsTotal.add(1, {
      method,
      route,
      status_code: statusCode.toString(),
    });
  }

  recordHttpRequestDuration(method: string, route: string, duration: number) {
    this.httpRequestDuration.record(duration, {
      method,
      route,
    });
  }

  setActiveConnections(count: number) {
    // For ObservableGauge, we need to update the callback
    // This is a simplified approach - in practice you might want to use a different pattern
    this.activeConnections.addCallback((result) => {
      result.observe(count, {});
    });
  }
}
