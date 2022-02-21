import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getConfiguration } from '@config/configuration';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    /* Setting Config: ConfigModule DI */
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? './env/production.env' : './env/development.env',
      isGlobal: true,
      load: [getConfiguration],
    }),
    /* morgan DI */
    MorganModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      // morgan 전역 설정
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'),
    },
  ],
})
export class AppModule {}
