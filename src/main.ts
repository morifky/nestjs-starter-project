import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './config/config';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const port = configService.getPort();
  const buildInformation = configService.getBuildInformation();
  const logger = new Logger("NEST APP")
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const options = new DocumentBuilder()
  .setTitle('NEST APP')
  .setDescription('NEST APP documentation')
  .setVersion('1.0')
  .addBearerAuth()
  .build()

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/apidocs', app, document);
  await app.listen(port);
  logger.debug(`NEST APP version:${buildInformation}`);
}
bootstrap();
