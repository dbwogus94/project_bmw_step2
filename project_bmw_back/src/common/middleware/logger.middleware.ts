import { Inject, Injectable, Logger, LoggerService, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const message: string = `${req.method} ${req.url} - body : ${JSON.stringify(req.body)}`;
    this.logger.debug!(message, 'LoggerMiddleware');
    // TODO: winston Logger을 사용 때문에 debug()가 무조건 있음을 !로 TS에 알림.
    next();
  }
}
