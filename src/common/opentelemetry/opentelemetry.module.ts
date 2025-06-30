import { Module } from '@nestjs/common';
import { TracingService } from './tracing.service';
import { MetricsService } from './metrics.service';

@Module({
  providers: [MetricsService, TracingService],
  exports: [MetricsService, TracingService],
})
export class OpenTelemetryModule {}
