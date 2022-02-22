import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { getConfiguration } from '@config/configuration';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpResponseInterceptor } from '@common/interceptor/http-response.interceptor';
import { HttpExceptionFilter } from '@common/filter/http-exception.filter';
import { LoggerMiddleware } from '@common/middleware/logger.middleware';

// TODO: winston 로거와 MorganInterceptor 연결 중
// class HttpLogger {
//   constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger) {}
//   getLogger(): WinstonLogger {
//     return this.logger;
//   }
// }

@Module({
  imports: [
    /* Setting Config: ConfigModule DI */
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? './env/production.env' : './env/development.env',
      isGlobal: true,
      load: [getConfiguration],
    }),
    /* winston http logger */
    // WinstonModule.forRoot(httpLoggerConfig),
    /* morgan DI */
    MorganModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    /* 전역 인터셉터 설정 - http 응답 처리 */
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpResponseInterceptor,
    },
    /* 전역 예외 필더 설정 - http 예외 필터 */
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    /* 전역 인터셉터 설정 - morgan 설정 */
    {
      provide: APP_INTERCEPTOR, // MorganInterceptor는 가장 마지막에 실행되도록 설정됨.
      useClass: MorganInterceptor(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'),
    },

    // TODO: winston 로거와 MorganInterceptor 연결 중
    // {
    //   provide: APP_INTERCEPTOR,
    //   useFactory: (logger: HttpLogger) => {
    //     const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
    //     const stream: StreamOptions = {
    //       write: (message) => logger.getLogger().verbose(message),
    //     };
    //     return MorganInterceptor(format, { stream });
    //   },
    //   // inject: [WinstonLogger],
    // },
  ],
})
export class AppModule implements NestModule {
  /* 전역 Middleware 설정 */
  configure(consumer: MiddlewareConsumer) {
    if (process.env.NODE_ENV !== 'production') {
      consumer.apply(LoggerMiddleware).forRoutes({ path: '/*', method: RequestMethod.ALL });
    }
  }
}
