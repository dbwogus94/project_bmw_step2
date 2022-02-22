import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getHttpSuccessMessages } from '@common/response-message';

export interface Response<T> {
  data: T;
}

@Injectable()
export class HttpResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    /* 컨트롤러 호출 전 */
    const { statusCode } = context.switchToHttp().getResponse();
    const routeName: string = context.getHandler().name;
    const messages: object | undefined = getHttpSuccessMessages(statusCode);
    const message: string = messages ? messages[routeName] : '요청에 성공하였습니다.';

    return next.handle().pipe(
      /* 컨트롤러 리턴 후 */
      map((data) => ({ statusCode, message, data })),
    );
  }
}
