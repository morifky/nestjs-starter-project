import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MetricsService } from './metrics.service';

@Injectable()
export class HttpMetricsMiddleware implements NestMiddleware {
  constructor(private readonly metricsService: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const method = req.method;
    const route = req.route?.path || req.baseUrl || 'unknown';
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = (Date.now() - startTime) / 1000;
      const statusCode = res.statusCode;
      this.metricsService.incrementHttpRequests(method, route, statusCode);
      this.metricsService.recordHttpRequestDuration(method, route, duration);
    });

    next();
  }
}
