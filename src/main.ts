import '@/common/opentelemetry/otel';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './config/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const port = configService.getPort();
  const buildInformation = configService.getBuildInformation();
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: false,
  });

  app.useLogger(app.get(Logger));
  app.use(cookieParser());

  app.setGlobalPrefix('api');
  const options = new DocumentBuilder()
    .setTitle('NEST APP')
    .setDescription('NEST APP documentation')
    .setVersion(`${buildInformation}`)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/apidocs', app, document);
  await app.listen(port);
  app.get(Logger).debug(`NEST APP version:${buildInformation}`);
}
bootstrap();
