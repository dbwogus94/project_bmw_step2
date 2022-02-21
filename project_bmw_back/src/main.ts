import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import { AppModule } from '@src/app.module';
import { ServerConfig } from '@config/config.interface';
import loggerConfig from '@config/app-logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // nest main logger winston으로 변경
    logger: WinstonModule.createLogger(loggerConfig),
  });

  app.enableCors();
  app.use(helmet());
  const config: ConfigService = app.get(ConfigService);
  const server: ServerConfig = config.get('server');
  await app.listen(server.port);
}
bootstrap();
