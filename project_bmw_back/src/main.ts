import helmet from 'helmet';
import { ServerConfig } from '@config/config.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  const config: ConfigService = app.get(ConfigService);
  const server: ServerConfig = config.get('server');
  await app.listen(server.port);
}
bootstrap();
