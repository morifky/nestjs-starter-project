import { Injectable } from '@nestjs/common';
import { metrics } from '@opentelemetry/api';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MetricsService {
  private readonly httpRequestsTotal;
  private readonly httpRequestDuration;
  private readonly activeConnections;
  private readonly memoryUsage;
  private readonly testCounter;

  constructor(private configService: ConfigService) {
    const meter = metrics.getMeter(
      configService.get('SERVICE_NAME'),
      configService.get('VERSION') || 'unknown',
    );

    this.httpRequestsTotal = meter.createCounter('http_requests_total', {
      description: 'Total number of HTTP requests',
    });

    this.httpRequestDuration = meter.createHistogram(
      'http_request_duration_seconds',
      {
        description: 'HTTP request duration in seconds',
        unit: 's',
      },
    );

    this.activeConnections = meter.createObservableGauge('active_connections', {
      description: 'Number of active connections',
    });
    this.activeConnections.addCallback((observableResult) => {
      observableResult.observe(0);
    });

    this.memoryUsage = meter.createObservableGauge('memory_usage_bytes', {
      description: 'Memory usage in bytes',
      unit: 'bytes',
    });
    this.memoryUsage.addCallback((observableResult) => {
      const memUsage = process.memoryUsage();
      observableResult.observe(memUsage.rss, { type: 'rss' });
      observableResult.observe(memUsage.heapUsed, { type: 'heap_used' });
      observableResult.observe(memUsage.heapTotal, { type: 'heap_total' });
      observableResult.observe(memUsage.external, { type: 'external' });
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
}
