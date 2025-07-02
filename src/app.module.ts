import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ProductModule } from '@/product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from 'nestjs-pino';
import {
  HttpMetricsMiddleware,
  OpenTelemetryModule,
} from '@/common/opentelemetry';
import pino from 'pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        MIGRATION_AUTO: Joi.boolean().default(false),
        VERSION: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        OTEL_EXPORTER_OTLP_ENDPOINT: Joi.string().required(),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        SERVICE_NAME: Joi.string().required(),
        LOG_LEVEL: Joi.string().default('info'),
        LOG_PATH: Joi.string().optional(),
      }),
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isDev = configService.get('NODE_ENV') === 'development';
        return {
          pinoHttp: isDev
            ? {
                level: configService.get('LOG_LEVEL') || 'info',
                timestamp: pino.stdTimeFunctions.isoTime,
                transport: {
                  target: 'pino/file',
                  options: {
                    destination:
                      configService.get('LOG_PATH') || '/app-logs/app.log',
                    mkdir: true,
                  },
                },
              }
            : {
                level: configService.get('LOG_LEVEL') || 'info',
                timestamp: pino.stdTimeFunctions.isoTime,
              },
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT'), 10),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize:
          configService.get('MIGRATION_AUTO') === 'true' ||
          configService.get('MIGRATION_AUTO') === true,
      }),
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
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
