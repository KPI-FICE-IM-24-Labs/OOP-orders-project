import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { Logger as PinoLogger } from 'nestjs-pino';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: true,
  });

  const config = app.get<ConfigService>(ConfigService);
  const logger = new Logger(bootstrap.name);

  const HOST = config.getOrThrow<string>('HOST');
  const PORT = config.getOrThrow<number>('PORT');

  app.useLogger(app.get<PinoLogger>(PinoLogger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors();
  app.use(helmet());
  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(PORT, HOST, () => {
    logger.log(`Service is running on http://${HOST}:${PORT}`);
  });
}
void bootstrap();
