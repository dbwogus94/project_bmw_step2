import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getConfiguration } from '@config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./env/development.env', './env/production.env'], // 0번째가 없으면 1번째 읽기 시도한다.
      isGlobal: true,
      load: [getConfiguration],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
