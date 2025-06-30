import { configService } from '@/config/config';
import { Injectable } from '@nestjs/common';
import {
  context,
  trace,
  Span,
  SpanOptions,
  Tracer,
  Context,
} from '@opentelemetry/api';

@Injectable()
export class TracingService {
  private readonly tracer: Tracer;

  constructor() {
    this.tracer = trace.getTracer(
      configService.getServiceName(),
      configService.getAppVersion() || 'unknown',
    );
  }

  startSpan<T>(name: string, options?: SpanOptions): Span;
  startSpan<T>(
    name: string,
    options: SpanOptions | undefined,
    fn: (span: Span) => Promise<T> | T,
  ): Promise<T>;
  startSpan<T>(
    name: string,
    options?: SpanOptions,
    fn?: (span: Span) => Promise<T> | T,
  ): Promise<T> | Span {
    if (fn) {
      return this.tracer.startActiveSpan(name, options || {}, async (span) => {
        try {
          return await fn(span);
        } finally {
          span.end();
        }
      });
    } else {
      return this.tracer.startSpan(name, options || {});
    }
  }

  getCurrentSpan(): Span | undefined {
    return trace.getSpan(context.active());
  }

  getCurrentContext(): Context {
    return context.active();
  }
}
