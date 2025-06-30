import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ProductModule } from '@/product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '@/config/config';
import { AuthModule } from '@/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from 'nestjs-pino';
import {
  HttpMetricsMiddleware,
  OpenTelemetryModule,
} from '@/common/opentelemetry';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'info',
        transport: {
          target: 'pino/file',
          options:
            configService.getNodeEnv() === 'development'
              ? {
                  destination: '/var/log/app/app.log',
                  mkdir: true,
                }
              : {},
        },
      },
    }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    JwtModule.register({
      secret: configService.getJwtSecret(),
      signOptions: { expiresIn: '1h' },
    }),
    ProductModule,
    AuthModule,
    OpenTelemetryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpMetricsMiddleware).forRoutes('*');
  }
}
