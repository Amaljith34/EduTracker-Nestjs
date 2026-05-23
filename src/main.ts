import 'reflect-metadata';
import { devLog } from './utils/helper/functions/log-helper';

devLog(
  'Global crypto:',
  typeof crypto !== 'undefined' ? 'Available' : 'NOT DEFINED',
);

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { swaggerConfig, swaggerCustomOption } from './configs/swaggerSetup.config';
import { RequestLoggingInterceptor } from './common/logging/request-logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  try {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      process.env.MOBILE_URL || 'http://localhost:8081',
    ].filter(Boolean);

    app.enableCors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new RequestLoggingInterceptor());

    if (process.env.LOG_LEVEL === 'production') {
      console.log = () => {};
      console.warn = () => {};
      console.debug = () => {};
    }

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-docs', app, document, swaggerCustomOption);

    const port = process.env.PORT || 4000;
    await app.listen(port);
    logger.log(
      `Server running at PORT: ${port} in ${process.env.STAGE ?? 'Dev'} stage`,
    );
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}

bootstrap();
